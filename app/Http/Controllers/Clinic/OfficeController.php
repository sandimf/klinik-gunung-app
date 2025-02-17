<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Payments;
use App\Models\Payments\PaymentOnline;
use App\Models\Transaction\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class OfficeController extends Controller
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
        $formattedTotalIncome = 'Rp '.number_format($totalIncome, 0, ',', '.');
        $formattedTotalProduct = 'Rp '.number_format($totalProductPrice, 0, ',', '.');
        $formattedTotalOverall = 'Rp '.number_format($totalOverallIncome, 0, ',', '.');

        // Hitung jumlah transaksi yang berhasil
        $successfulTransactions = $paymentsAll->count();

        // Dapatkan tanggal pembayaran terbaru
        $lastPaymentDate = $paymentsAll->isNotEmpty()
            ? Carbon::parse($paymentsAll->first()->created_at)
                ->timezone('Asia/Jakarta')
                ->translatedFormat('j F Y')
            : null;

        // Format data pembayaran untuk tampilan
        $paymentsDetails = $paymentsAll->take(3)->map(function ($payment) {
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

        // Kirim data ke view
        return Inertia::render('Dashboard/Cashier/Office/Index', [
            'totalPayment' => $formattedTotalIncome,
            'totalIncome' => $formattedTotalIncome,
            'totalProductIncome' => $formattedTotalProduct,
            'totalOverallIncome' => $formattedTotalOverall,
            'lastPaymentDate' => $lastPaymentDate,
            'successfulTransactions' => $successfulTransactions,
            'paymentsDetails' => $paymentsDetails,
        ]);
    }

    public function generatePdf()
    {
        // Ambil semua pembayaran yang berhasil
        $payments = Payments::with(['patient.user', 'medicineBatch'])
            ->where('payment_status', true)
            ->select('amount_paid', 'created_at', 'patient_id', 'medicine_batch_id', 'quantity_product')
            ->orderBy('created_at', 'desc')
            ->get();

        // Hitung total pemasukan dari pembayaran
        $totalIncome = $payments->sum('amount_paid');

        // Hitung total pemasukan dari produk
        $totalProductPrice = Transaction::sum('total_price');

        // Hitung total keseluruhan pemasukan (pembayaran + produk)
        $totalOverallIncome = $totalIncome + $totalProductPrice;

        // Hitung jumlah transaksi yang berhasil
        $successfulTransactions = $payments->count();

        // Dapatkan tanggal pembayaran terbaru
        $lastPaymentDate = $payments->isNotEmpty()
            ? Carbon::parse($payments->first()->created_at)
                ->timezone('Asia/Jakarta')
                ->translatedFormat('j F Y')
            : null;

        // Format data pembayaran untuk tampilan PDF
        $paymentsDetails = $payments->take(3)->map(function ($payment) {
            $payment->formatted_date = Carbon::parse($payment->created_at)
                ->timezone('Asia/Jakarta')
                ->translatedFormat('j F Y');

            $payment->patient_name = $payment->patient ? $payment->patient->name : 'Tidak diketahui';
            $payment->medicine_details = $payment->medicineBatch ? $payment->medicineBatch->name : '-';
            $payment->quantity_details = $payment->quantity_product ? $payment->quantity_product : '-';

            $payment->medicine_income = $payment->medicineBatch ? $payment->medicineBatch->price * $payment->quantity_product : 0;
            $payment->patient_avatar = $payment->patient && $payment->patient->user ? $payment->patient->user->avatar : 'default-avatar.jpg';

            return $payment;
        });

        // Hitung total pemasukan dari obat
        $totalMedicineIncome = $paymentsDetails->sum('medicine_income');

        // Format angka sebagai IDR (Rp)
        $formattedTotalIncome = 'Rp '.number_format($totalIncome, 0, ',', '.');
        $formattedTotalProduct = 'Rp '.number_format($totalProductPrice, 0, ',', '.');
        $formattedTotalOverall = 'Rp '.number_format($totalOverallIncome, 0, ',', '.');

        // Data yang akan dikirimkan ke view PDF
        $data = [
            'totalIncome' => $formattedTotalIncome,
            'totalProductIncome' => $formattedTotalProduct,
            'totalOverallIncome' => $formattedTotalOverall,
            'totalMedicineIncome' => $totalMedicineIncome,
            'lastPaymentDate' => $lastPaymentDate,
            'successfulTransactions' => $successfulTransactions,
            'paymentsDetails' => $paymentsDetails,
        ];

        // Generate PDF
        $pdf = Pdf::loadView('pdf.office.index', $data);  // Nama view PDF dan data yang dikirimkan

        // Menentukan nama file berdasarkan tanggal hari ini
        $fileName = Carbon::now()->translatedFormat('j_F_Y').'_laporan_pembayaran.pdf';

        // Kembalikan PDF sebagai response dengan nama file yang sesuai
        return $pdf->download($fileName);
    }
}
