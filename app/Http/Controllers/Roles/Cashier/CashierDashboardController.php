<?php

namespace App\Http\Controllers\Roles\Cashier;

use App\Http\Controllers\Controller;
use App\Models\Payments;
use App\Models\Payments\PaymentOnline;
use App\Models\Transaction\Transaction;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class CashierDashboardController extends Controller
{
    public function index()
    {
        // Ambil semua pembayaran yang berhasil (offline)
        $payments = Payments::with(['patient.user', 'medicineBatch'])
            ->where('payment_status', true)
            ->orderBy('created_at', 'desc')
            ->get();

        // Ambil semua pembayaran online yang berhasil
        $paymentsOnline = PaymentOnline::with(['patient.user', 'screeningAnswer'])
            ->where('payment_status', true)
            ->orderBy('created_at', 'desc')
            ->get();

        // Gabungkan pembayaran offline dan online
        $paymentsAll = $payments->merge($paymentsOnline);

        // Hitung total pemasukan dari pembayaran
        $totalIncome = $paymentsAll->sum('amount_paid');

        // Hitung total harga produk dari transaksi
        $totalProductPrice = Transaction::sum('total_price');

        // Hitung total keseluruhan pemasukan (pembayaran + produk)
        $totalOverallIncome = $totalIncome + $totalProductPrice;

        // Format semua angka sebagai IDR (Rp)
        $formattedTotalIncome = $this->formatCurrency($totalIncome);
        $formattedTotalProduct = $this->formatCurrency($totalProductPrice);
        $formattedTotalOverall = $this->formatCurrency($totalOverallIncome);

        // Hitung jumlah transaksi yang berhasil
        $successfulTransactions = $paymentsAll->count();

        // Dapatkan tanggal pembayaran terbaru
        $lastPaymentDate = $this->getLastPaymentDate($paymentsAll);

        // Format data pembayaran untuk tampilan
        $paymentsDetails = $this->formatPaymentsDetails($paymentsAll);

        // Data chart pemasukan per bulan (6 bulan terakhir)
        $chartData = $this->getChartData($paymentsAll);

        // Data chart pemasukan produk per bulan (6 bulan terakhir)
        $chartDataProduct = $this->getChartDataProduct();

        // Kirim data ke view
        return Inertia::render('Dashboard/Cashier/Index', [
            'totalPayment' => $formattedTotalIncome,
            'totalIncome' => $formattedTotalIncome,
            'totalProductIncome' => $formattedTotalProduct,
            'totalOverallIncome' => $formattedTotalOverall,
            'lastPaymentDate' => $lastPaymentDate,
            'successfulTransactions' => $successfulTransactions,
            'paymentsDetails' => $paymentsDetails,
            'chartData' => $chartData,
            'chartDataProduct' => $chartDataProduct,
        ]);
    }

    private function formatCurrency($amount)
    {
        return 'Rp '.number_format($amount, 0, ',', '.');
    }

    private function getLastPaymentDate($paymentsAll)
    {
        return $paymentsAll->isNotEmpty()
            ? Carbon::parse($paymentsAll->first()->created_at)
                ->timezone('Asia/Jakarta')
                ->translatedFormat('j F Y')
            : null;
    }

    private function formatPaymentsDetails($paymentsAll)
    {
        return $paymentsAll->take(3)->map(function ($payment) {
            $payment->formatted_date = Carbon::parse($payment->created_at)
                ->timezone('Asia/Jakarta')
                ->translatedFormat('j F Y');

            if ($payment instanceof PaymentOnline) {
                $payment->patient_name = $payment->patient ? $payment->patient->name : 'Tidak diketahui';
                $payment->screening_details = $payment->screeningAnswer ? $payment->screeningAnswer->answer : 'Tidak ada jawaban screening';
            } else {
                $payment->patient_name = $payment->patient ? $payment->patient->name : 'Tidak diketahui';
                $payment->medicine_details = $payment->medicineBatch ? $payment->medicineBatch->name : 'Obat tidak tersedia';
                $payment->quantity_details = $payment->quantity_product ? $payment->quantity_product : 'Jumlah tidak tersedia';
            }

            // Avatar
            $payment->patient_avatar = $payment->patient && $payment->patient->user ? $payment->patient->user->avatar : 'default-avatar.jpg';

            return $payment;
        });
    }

    private function getChartData($paymentsAll)
    {
        $months = collect(range(0, 5))->map(function ($i) {
            return now()->subMonths($i)->format('M');
        })->reverse()->values();

        return $months->map(function ($month) use ($paymentsAll) {
            $monthNum = Carbon::parse($month)->month;
            $year = now()->year;
            $pemasukan = $paymentsAll->filter(function ($p) use ($monthNum, $year) {
                $date = Carbon::parse($p->created_at);

                return $date->month === $monthNum && $date->year === $year;
            })->sum('amount_paid');

            return [
                'month' => $month,
                'pemasukan' => $pemasukan,
            ];
        });
    }

    private function getChartDataProduct()
    {
        $months = collect(range(0, 5))->map(function ($i) {
            return now()->subMonths($i)->format('M');
        })->reverse()->values();

        return $months->map(function ($month) {
            $monthNum = Carbon::parse($month)->month;
            $year = now()->year;
            $pemasukanProduk = Transaction::whereMonth('created_at', $monthNum)
                ->whereYear('created_at', $year)
                ->sum('total_price');

            return [
                'month' => $month,
                'produk' => $pemasukanProduk,
            ];
        });
    }
}
