<?php

namespace App\Http\Controllers\Cashier\v2;

use Inertia\Inertia;
use App\Models\Payments;
use App\Http\Controllers\Controller;

class ActivityCashierController extends Controller
{
    public function index()
    {
        // Ambil semua data payments dengan relasi patient dan cashier
        $payments = Payments::with(['patient', 'cashier'])->get();

        // Hitung total kasir yang terlibat

        // Hitung total pembayaran (diformat ke IDR)
        $totalPayment = number_format($payments->sum('amount_paid'), 0, ',', '.');

        // Hitung total transaksi
        $totalTransactions = $payments->count();

        // Hitung total transaksi berdasarkan metode pembayaran (cash, qris, transfer)
        $paymentMethodsCount = $payments->groupBy('payment_method')->map->count();

        // Ambil data detail pembayaran
        $cashierActivities = $payments->map(function ($payment) {
            return [
                'id'             => $payment->id,
                'patient_name'   => $payment->patient->name ?? 'Tidak Diketahui',
                'gender'         => $payment->patient->gender ?? '-',
                'amount_paid'    => 'Rp ' . number_format($payment->amount_paid, 0, ',', '.'),
                'payment_method' => ucfirst($payment->payment_method),
                'cashier_name'   => $payment->cashier->name ?? 'Tidak Diketahui',
                'payment_proof'   => $payment->payment_proof ?? 'Tidak Diketahui',
                'created_at'     => $payment->created_at->format('d-m-Y H:i'),
            ];
        });

        // Kirim data ke frontend
        return Inertia::render('Dashboard/Cashier/ActivityCashier/Index', [
            'cashierActivities' => $cashierActivities,
            'totalPayment'      => 'Rp ' . $totalPayment,
            'totalTransactions' => $totalTransactions,
            'paymentMethodsCount' => $paymentMethodsCount,
        ]);
    }
}
