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
        $search = $request->input('search');
        if ($search !== null) {
            $search = filter_var($search, FILTER_SANITIZE_STRING);
            $search = trim(strip_tags($search));
        }
        $page = max(1, (int) filter_var($request->input('page', 1), FILTER_VALIDATE_INT, [
            'options' => [
                'default' => 1,
                'min_range' => 1,
            ],
        ]));
        $perPage = 10;

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

        // Add search condition if provided (with sanitization)
        if (! empty($search)) {
            $screenings_offline->where('patients.name', 'LIKE', '%'.$search.'%');
        }

        // Execute the query and get the results
        $screenings_offline = $screenings_offline
            ->orderBy('q.queue', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        // Preserve query parameters in pagination links
        $screenings_offline->appends($request->query());

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

        // Get medicines and amounts
        $medicines = Medicine::with(['pricing', 'batches'])->get();
        $amounts = AmountScreening::all();
        // Get products
        $products = \App\Models\Product::all();

        // Format the data for the frontend
        $formattedOffline = $screenings_offline->getCollection()->map(function ($item) use ($offlinePayments) {
            $item->payments = isset($offlinePayments[$item->id]) ? [$offlinePayments[$item->id]] : [];

            return $item;
        });
        $screenings_offline->setCollection($formattedOffline);

        return Inertia::render('Dashboard/Cashier/Screenings/Index', [
            'screenings_offline' => $screenings_offline,
            'medicines' => $medicines,
            'amounts' => $amounts,
            'products' => $products,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
