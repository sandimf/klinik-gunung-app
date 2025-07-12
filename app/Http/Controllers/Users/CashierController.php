<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Medicines\Medicine;
use App\Models\Payments;
use App\Models\Roles\Admin\Management\AmountScreening;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CashierController extends Controller
{
    /**
     * Display screening
     */
    public function screenings(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 20;
        $search = $request->input('search');

        $screenings_offline = \DB::table('patients')
            ->select('patients.id', 'patients.uuid', 'patients.name', 'patients.payment_status', 'q.queue', 'patients.screening_status')
            ->join(\DB::raw('(
                SELECT patient_id, MIN(queue) as queue
                FROM screening_offline_answers
                WHERE answer_text IS NOT NULL
                GROUP BY patient_id
            ) as q'), 'patients.id', '=', 'q.patient_id')
            ->whereIn('patients.payment_status', ['pending', 'completed']);
        if ($search) {
            $screenings_offline->where('patients.name', 'like', '%'.$search.'%');
        }
        $screenings_offline = $screenings_offline
            ->orderBy('q.queue', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        $screenings_online = \DB::table('patients_online')
            ->select('patients_online.id', 'patients_online.uuid', 'patients_online.name', 'patients_online.payment_status', 'q.queue', 'patients.screening_status')
            ->join(\DB::raw('(
                SELECT patient_id, MIN(queue) as queue
                FROM screening_online_answers
                WHERE answer_text IS NOT NULL
                GROUP BY patient_id
            ) as q'), 'patients_online.id', '=', 'q.patient_id')
            ->where('patients_online.payment_status', 'checking');
        if ($search) {
            $screenings_online->where('patients_online.name', 'like', '%'.$search.'%');
        }
        $screenings_online = $screenings_online
            ->orderBy('q.queue', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        $medicines = Medicine::with(['pricing', 'batches'])->get();
        $amounts = AmountScreening::all();

        return Inertia::render('Dashboard/Cashier/Screenings/Index', [
            'screenings_offline' => $screenings_offline,
            'screenings_online' => $screenings_online,
            'medicines' => $medicines,
            'amounts' => $amounts,
        ]);
    }

    public function historyPaymentsOffline()
    {
        // Ambil data pasien dengan pembayaran dan screening yang relevan
        $patients = Patients::with([
            'payments',                // Relasi ke payments
            'answers.question',        // Relasi ke jawaban dan pertanyaan screening
        ])
            ->whereHas('payments', function ($query) {
                $query->where('payment_status', true); // Hanya yang sudah selesai pembayarannya
            })
            ->get();

        // Muat semua data obat dengan pricing
        $medicines = Medicine::with('pricing')->get();

        return Inertia::render('Dashboard/Cashier/Payments/HistoryPaymentsScreeningOffline', [
            'patients' => $patients,
            'medicines' => $medicines,
        ]);
    }

    public function historyPaymentsOnline()
    {
        // Ambil data pasien dengan pembayaran dan screening yang relevan
        $patients = PatientsOnline::with([
            'payments',                // Relasi ke payments
            'answers.question',        // Relasi ke jawaban dan pertanyaan screening
        ])
            ->whereHas('payments', function ($query) {
                $query->where('payment_status', true);
            })
            ->get();

        return Inertia::render('Dashboard/Cashier/Payments/HistoryPaymentsScreeningOnline', [
            'patients' => $patients,
        ]);
    }

    public function showPayment($id)
    {
        $screening = PatientsOnline::with(['payment'])
            ->where('id', $id)
            ->first();

        if (! $screening) {
            return redirect()->route('cashier.screening-online')->with('error', 'Screening tidak ditemukan.');
        }
        $payment = $screening->payment;

        return Inertia::render('Dashboard/Cashier/Screenings/Payments/OnlinePayments', [
            'screening' => $screening,
            'payment' => $payment,
        ]);
    }
}
