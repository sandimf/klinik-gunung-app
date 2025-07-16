<?php

namespace App\Http\Controllers\Roles\Cashier\Screening;

use App\Http\Controllers\Controller;
use App\Models\Medicines\Medicine;
use App\Models\Roles\Admin\Management\AmountScreening;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScreeningPaymentListController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 20;
        $search = $request->input('search');

        // First, get the base query for offline screenings
        $screenings_offline = \DB::table('patients')
            ->select(
                'patients.id',
                'patients.uuid',
                'patients.name',
                'patients.payment_status',
                'q.queue',
                'patients.screening_status'
            )
            ->leftJoin(\DB::raw('(
                SELECT patient_id, MIN(queue) as queue
                FROM screening_offline_answers
                WHERE answer_text IS NOT NULL
                GROUP BY patient_id
            ) as q'), 'patients.id', '=', 'q.patient_id')
            ->whereIn('patients.payment_status', ['pending', 'completed']);

        // Add search condition if provided
        if ($search) {
            $screenings_offline->where('patients.name', 'like', '%'.$search.'%');
        }
        // Execute the query and get the results
        $screenings_offline = $screenings_offline
            ->orderBy('q.queue', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        // Get the latest payment for each offline patient
        $offlinePatientIds = collect($screenings_offline->items())->pluck('id');
        $offlinePayments = [];
        if ($offlinePatientIds->isNotEmpty()) {
            $offlinePayments = \DB::table('payments')
                ->select('id', 'patient_id', 'no_transaction', 'created_at')
                ->whereIn('patient_id', $offlinePatientIds)
                ->whereIn('id', function ($query) {
                    $query->select(\DB::raw('MAX(id)'))
                        ->from('payments')
                        ->groupBy('patient_id');
                })
                ->get()
                ->groupBy('patient_id')
                ->map(function ($payments) {
                    $payment = $payments->first();

                    return [
                        'id' => $payment->id,
                        'no_transaction' => $payment->no_transaction,
                        'created_at' => $payment->created_at,
                    ];
                })
                ->toArray();
        }

        // Process online screenings
        $screenings_online = \DB::table('patients_online')
            ->select(
                'patients_online.id',
                'patients_online.uuid',
                'patients_online.name',
                'patients_online.payment_status',
                'q.queue',
                'patients_online.screening_status'
            )
            ->leftJoin(\DB::raw('(
                SELECT patient_id, MIN(queue) as queue
                FROM screening_online_answers
                WHERE answer_text IS NOT NULL
                GROUP BY patient_id
            ) as q'), 'patients_online.id', '=', 'q.patient_id')
            ->where('patients_online.payment_status', 'checking');
        // Add search condition if provided for online screenings
        if ($search) {
            $screenings_online->where('patients_online.name', 'like', '%'.$search.'%');
        }

        // Execute the query and get the results
        $screenings_online = $screenings_online
            ->orderBy('q.queue', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        // Get the latest payment for each online patient
        $onlinePatientIds = collect($screenings_online->items())->pluck('id');
        $onlinePayments = [];
        if ($onlinePatientIds->isNotEmpty()) {
            $onlinePayments = \DB::table('payments')
                ->select('id', 'patient_id', 'no_transaction', 'created_at')
                ->whereIn('patient_id', $onlinePatientIds)
                ->whereIn('id', function ($query) {
                    $query->select(\DB::raw('MAX(id)'))
                        ->from('payments')
                        ->groupBy('patient_id');
                })
                ->get()
                ->groupBy('patient_id')
                ->map(function ($payments) {
                    $payment = $payments->first();

                    return [
                        'id' => $payment->id,
                        'no_transaction' => $payment->no_transaction,
                        'created_at' => $payment->created_at,
                    ];
                })
                ->toArray();
        }

        // Get medicines and amounts
        $medicines = Medicine::with(['pricing', 'batches'])->get();
        $amounts = AmountScreening::all();

        // Format the data for the frontend
        $formattedOffline = $screenings_offline->getCollection()->map(function ($item) use ($offlinePayments) {
            $item->payments = isset($offlinePayments[$item->id]) ? [$offlinePayments[$item->id]] : [];

            return $item;
        });
        $screenings_offline->setCollection($formattedOffline);

        $formattedOnline = $screenings_online->getCollection()->map(function ($item) use ($onlinePayments) {
            $item->payments = isset($onlinePayments[$item->id]) ? [$onlinePayments[$item->id]] : [];

            return $item;
        });
        $screenings_online->setCollection($formattedOnline);

        return Inertia::render('Dashboard/Cashier/Screenings/Index', [
            'screenings_offline' => $screenings_offline,
            'screenings_online' => $screenings_online,
            'medicines' => $medicines,
            'amounts' => $amounts,
        ]);
    }
}
