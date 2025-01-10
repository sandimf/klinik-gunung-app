<?php

namespace App\Http\Controllers\Clinic;

use Inertia\Inertia;
use App\Models\Payments;
use Illuminate\Support\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use App\Models\Payments\PaymentOnline;

class OfficeController extends Controller
{
    public function index()
    {
        // Ambil semua pembayaran yang berhasil (offline), dan juga data pasien serta informasi lainnya
        $payments = Payments::with(['patient.user', 'medicineBatch'])  // Menyertakan hubungan dengan model Patient dan User
            ->where('payment_status', true)  // Hanya pembayaran berhasil
            ->select('amount_paid', 'created_at', 'patient_id', 'medicine_batch_id', 'quantity_product')  // Ambil kolom yang diperlukan
            ->orderBy('created_at', 'desc')  // Urutkan berdasarkan tanggal terbaru
            ->get();
    
        // Ambil semua pembayaran online yang berhasil
        $paymentsOnline = PaymentOnline::with(['patient.user', 'screeningAnswer'])  // Menyertakan hubungan dengan model Patient dan ScreeningAnswer
            ->where('payment_status', true)  // Hanya pembayaran berhasil
            ->select('amount_paid', 'created_at', 'patient_id', 'payment_method', 'payment_proof')  // Ambil kolom yang diperlukan
            ->orderBy('created_at', 'desc')  // Urutkan berdasarkan tanggal terbaru
            ->get();
    
        // Gabungkan pembayaran offline dan online
        $paymentsAll = $payments->merge($paymentsOnline);
    
        // Hitung total pemasukan
        $totalIncome = $paymentsAll->sum('amount_paid');
    
        // Hitung jumlah transaksi yang berhasil
        $successfulTransactions = $paymentsAll->count();
    
        // Dapatkan tanggal pembayaran terbaru dalam zona waktu Asia/Jakarta
        $lastPaymentDate = $paymentsAll->isNotEmpty()
            ? Carbon::parse($paymentsAll->first()->created_at)
            ->timezone('Asia/Jakarta') // Mengatur zona waktu
            ->translatedFormat('j F Y') // Format tanggal: 7 January 2025
            : null;
    
        // Format data untuk setiap pembayaran yang berhasil dan menampilkan informasi tambahan (misal: nama pasien dan detail pembelian)
        $paymentsDetails = $paymentsAll->take(3)->map(function ($payment) {
            $payment->formatted_date = Carbon::parse($payment->created_at)
                ->timezone('Asia/Jakarta')
                ->translatedFormat('j F Y'); // Format tanggal transaksi
    
            if ($payment instanceof PaymentOnline) {
                // Pembayaran online
                $payment->patient_name = $payment->patient ? $payment->patient->name : 'Tidak diketahui';
                $payment->screening_details = $payment->screeningAnswer ? $payment->screeningAnswer->answer : 'Tidak ada jawaban screening';
            } else {
                // Pembayaran offline
                $payment->patient_name = $payment->patient ? $payment->patient->name : 'Tidak diketahui';
                $payment->medicine_details = $payment->medicineBatch ? $payment->medicineBatch->name : 'Obat tidak tersedia';
                $payment->quantity_details = $payment->quantity_product ? $payment->quantity_product : 'Jumlah tidak tersedia';
            }
    
            // Ambil avatar pengguna dari relasi user
            $payment->patient_avatar = $payment->patient && $payment->patient->user ? $payment->patient->user->avatar : 'default-avatar.jpg';  // Default jika tidak ada avatar
    
            return $payment;
        });
    
        // Hitung total pemasukan dari obat (medicine_income)
        $totalMedicineIncome = $paymentsDetails->sum('medicine_income');  // Menghitung total pemasukan obat
    
        // Kirim data ke view
        return Inertia::render('Dashboard/Cashier/Office/Index', [
            'totalIncome' => $totalIncome,  // Total pemasukan
            'totalMedicineIncome' => $totalMedicineIncome,  // Total pemasukan dari obat
            'lastPaymentDate' => $lastPaymentDate,  // Tanggal transaksi terbaru
            'successfulTransactions' => $successfulTransactions,  // Jumlah transaksi berhasil
            'paymentsDetails' => $paymentsDetails,  // Informasi detail pembayaran
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
        $fileName = Carbon::now()->translatedFormat('j_F_Y') . '_laporan_pembayaran.pdf';  // Menggunakan format tanggal

        // Kembalikan PDF sebagai response dengan nama file yang dihasilkan
        return $pdf->download($fileName);  // Unduh file PDF dengan nama yang sesuai dengan tanggal
    }
}
