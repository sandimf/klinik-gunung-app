<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Payments;
use App\Models\Payments\PaymentOnline;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class OfficeController extends Controller
{
    public function index()
    {
        // Ambil semua pembayaran yang berhasil (offline), dan juga data pasien serta informasi lainnya
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
        $totalPayment = number_format($payments->sum('amount_paid'), 0, ',', '.'); // Format as IDR (Rp)
        $paymentsAll = $payments->merge($paymentsOnline);

        // Debug: Print the amount paid of each payment

        // Hitung total pemasukan (Pastikan penjumlahan dilakukan setelah penggabungan)
        $totalIncome = $paymentsAll->sum('amount_paid');  // Sum the amount_paid correctly after merging

        // Format total pemasukan sebagai IDR (Rp) jika diperlukan
        $formattedTotalIncome = number_format($totalIncome, 0, ',', '.');  // Format as IDR (Rp)

        // Hitung jumlah transaksi yang berhasil
        $successfulTransactions = $paymentsAll->count();

        // Dapatkan tanggal pembayaran terbaru dalam zona waktu Asia/Jakarta
        $lastPaymentDate = $paymentsAll->isNotEmpty()
            ? Carbon::parse($paymentsAll->first()->created_at)
                ->timezone('Asia/Jakarta')
                ->translatedFormat('j F Y')
            : null;

        // Format data untuk setiap pembayaran yang berhasil dan menampilkan informasi tambahan
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

        // Hitung total pemasukan dari obat (medicine_income)
        $totalMedicineIncome = $paymentsDetails->sum('medicine_income');

        // Kirim data ke view
        return Inertia::render('Dashboard/Cashier/Office/Index', [
            'totalPayment' => $totalPayment,
            'totalIncome' => 'Rp '.$formattedTotalIncome,
            'totalMedicineIncome' => $totalMedicineIncome,
            'lastPaymentDate' => $lastPaymentDate,
            'successfulTransactions' => $successfulTransactions,
            'paymentsDetails' => $paymentsDetails,
        ]);
    }

    public function generatePdf()
    {
        // Ambil semua pembayaran yang berhasil, dan juga data pasien serta informasi lainnya
        $payments = Payments::with(['patient.user', 'medicineBatch'])
            ->where('payment_status', true)
            ->select('amount_paid', 'created_at', 'patient_id', 'medicine_batch_id', 'quantity_product')
            ->orderBy('created_at', 'desc')
            ->get();

        // Hitung total pemasukan
        $totalIncome = $payments->sum('amount_paid');

        // Hitung jumlah transaksi yang berhasil
        $successfulTransactions = $payments->count();

        // Dapatkan tanggal pembayaran terbaru dalam zona waktu Asia/Jakarta
        $lastPaymentDate = $payments->isNotEmpty()
            ? Carbon::parse($payments->first()->created_at)
                ->timezone('Asia/Jakarta')
                ->translatedFormat('j F Y')
            : null;

        // Format data untuk setiap pembayaran yang berhasil
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

        // Data yang akan dikirimkan ke view PDF
        $data = [
            'totalIncome' => $totalIncome,
            'totalMedicineIncome' => $totalMedicineIncome,
            'lastPaymentDate' => $lastPaymentDate,
            'successfulTransactions' => $successfulTransactions,
            'paymentsDetails' => $paymentsDetails,
        ];

        // Generate PDF
        $pdf = Pdf::loadView('pdf.office.index', $data);  // Nama view PDF dan data yang akan dikirimkan

        // Menentukan nama file berdasarkan tanggal hari ini (misalnya, 7 Januari 2025)
        $fileName = Carbon::now()->translatedFormat('j_F_Y').'_laporan_pembayaran.pdf';  // Menggunakan format tanggal

        // Kembalikan PDF sebagai response dengan nama file yang dihasilkan
        return $pdf->download($fileName);  // Unduh file PDF dengan nama yang sesuai dengan tanggal
    }
}
