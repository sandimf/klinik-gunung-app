<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\Payments;
use Inertia\Inertia;

class CashierReportController extends Controller
{
    public function activity()
    {
        // Ambil semua data payments
        $payments = Payments::with(['patient', 'cashier'])->get();

        // Hitung total jumlah cashier yang terlibat
        $totalCashier = $payments->pluck('cashier_id')->unique()->count();

        // Hitung total pembayaran dan format ke IDR
        $totalPayment = number_format($payments->sum('amount_paid'), 0, ',', '.'); // Format as IDR (Rp)

        // Hitung total jumlah transaksi
        $totalTransactions = $payments->count();

        // Hitung total transaksi berdasarkan metode pembayaran (cash, qris, transfer)
        $paymentMethodsCount = $payments->groupBy('payment_method')->map(function ($group) {
            return $group->count();
        });

        // Ambil nama-nama pasien beserta Cashier yang memeriksa dan format amount_paid ke IDR
        $patients = $payments->map(function ($payment) {
            return [
                'id' => $payment->patient->id,
                'name' => $payment->patient->name,
                'gender' => $payment->patient->gender,
                'amount_paid' => 'Rp ' . number_format($payment->amount_paid, 0, ',', '.'), // Format amount_paid as IDR
                'payment_method' => $payment->payment_method,
                'payment_by' => $payment->cashier->name ?? 'Tidak Diketahui', // Nama Cashier
            ];
        });

        // Kirim data ke frontend
        return Inertia::render('Dashboard/Cashier/Activity/Index', [
            'patients' => $patients,
            'totalCashier' => $totalCashier,
            'totalPayment' => 'Rp ' . $totalPayment, // Format total payment as IDR with "Rp" prefix
            'totalTransactions' => $totalTransactions,
            'paymentMethodsCount' => $paymentMethodsCount, // Add payment method count to the response
        ]);
    }
}
