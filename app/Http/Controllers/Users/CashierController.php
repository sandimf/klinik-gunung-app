<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Medicines\Medicine;
use App\Models\Payments;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Inertia\Inertia;

class CashierController extends Controller
{
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
