<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\Clinic\PhysicalExamination;
use App\Models\Payments;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ManagerReportController extends Controller
{
    public function index()
    {
        // Ambil semua data pemeriksaan fisik dan relasi dengan pasien serta paramedis
        $examinations = PhysicalExamination::with(['patient', 'paramedis'])->get();

        // Hitung total jumlah pasien yang diperiksa
        $totalPatients = $examinations->count();

        // Hitung jumlah pasien yang sakit
        $sickPatientsCount = $examinations->where('health_status', 'butuh_dokter')->count();

        // Hitung total jumlah paramedis yang terlibat
        $totalParamedis = $examinations->pluck('paramedis_id')->unique()->count();

        // Ambil nama-nama pasien beserta paramedis yang memeriksa
        $patients = $examinations->map(function ($examination) {
            return [
                'id' => $examination->patient->id,
                'name' => $examination->patient->name,
                'health_status' => $examination->health_status,
                'date_of_birth' => $examination->patient->date_of_birth,
                'gender' => $examination->patient->gender,
                'examined_by' => $examination->paramedis->name ?? 'Tidak Diketahui', // Nama paramedis
            ];
        });

        // Kirim data ke frontend
        return Inertia::render('Dashboard/Manager/Screenings/Index', [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
            'totalParamedis' => $totalParamedis, // Menambahkan jumlah paramedis
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
