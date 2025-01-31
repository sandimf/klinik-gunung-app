<?php

namespace App\Http\Controllers\Dashboard;

use Inertia\Inertia;
use App\Models\Payments;
use App\Models\Users\Admin;
use App\Models\Users\Doctor;
use App\Models\Users\Cashier;
use App\Models\Users\Patients;
use Illuminate\Support\Carbon;
use App\Models\Users\Paramedis;
use App\Models\Users\Warehouse;
use Barryvdh\DomPDF\Facade\pdf;
use App\Models\Medicines\Medicine;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Models\Payments\PaymentOnline;
use App\Models\Transaction\Transaction;
use App\Models\Clinic\PhysicalExamination;

class ManagerPanelController extends Controller
{
    public function office()
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
        $formattedTotalIncome = 'Rp ' . number_format($totalIncome, 0, ',', '.');
        $formattedTotalProduct = 'Rp ' . number_format($totalProductPrice, 0, ',', '.');
        $formattedTotalOverall = 'Rp ' . number_format($totalOverallIncome, 0, ',', '.');
    
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
        return Inertia::render('Dashboard/Manager/Office/Index', [
            'totalPayment' => $formattedTotalIncome,
            'totalIncome' => $formattedTotalIncome,
            'totalProductIncome' => $formattedTotalProduct,
            'totalOverallIncome' => $formattedTotalOverall,
            'lastPaymentDate' => $lastPaymentDate,
            'successfulTransactions' => $successfulTransactions,
            'paymentsDetails' => $paymentsDetails,
        ]);
    }

    public function staff()
    {
        $doctors = collect(Doctor::with('user')->get()->map(function ($doctor) {
            return [
                'id' => $doctor->id,
                'nik' => $doctor->nik,
                'role' => $doctor->role,
                'user_id' => $doctor->user_id,
                'name' => $doctor->name,
                'email' => $doctor->user->email,
                'address' => $doctor->address,
                'date_of_birth' => $doctor->date_of_birth,
                'phone' => $doctor->phone,
                'created_at' => $doctor->created_at,
                'updated_at' => $doctor->updated_at,
            ];
        }));

        $cashiers = collect(Cashier::with('user')->get()->map(function ($cashier) {
            return [
                'id' => $cashier->id,
                'nik' => $cashier->nik,
                'role' => $cashier->role,
                'user_id' => $cashier->user_id,
                'name' => $cashier->name,
                'email' => $cashier->user->email,
                'address' => $cashier->address,
                'date_of_birth' => $cashier->date_of_birth,
                'phone' => $cashier->phone,
                'created_at' => $cashier->created_at,
                'updated_at' => $cashier->updated_at,
            ];
        }));

        $paramedis = collect(Paramedis::with('user')->get()->map(function ($paramedi) {
            return [
                'id' => $paramedi->id,
                'nik' => $paramedi->nik,
                'role' => $paramedi->role,
                'user_id' => $paramedi->user_id,
                'name' => $paramedi->name,
                'email' => $paramedi->user->email,
                'address' => $paramedi->address,
                'date_of_birth' => $paramedi->date_of_birth,
                'phone' => $paramedi->phone,
                'created_at' => $paramedi->created_at,
                'updated_at' => $paramedi->updated_at,
            ];
        }));

        $admins = collect(Admin::with('user')->get()->map(function ($admin) {
            return [
                'id' => $admin->id,
                'nik' => $admin->nik,
                'role' => $admin->role,
                'user_id' => $admin->user_id,
                'name' => $admin->name,
                'email' => $admin->user->email,
                'address' => $admin->address,
                'date_of_birth' => $admin->date_of_birth,
                'phone' => $admin->phone,
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at,
            ];
        }));
        $warehouse = collect(Warehouse::with('user')->get()->map(function ($warehouse) {
            return [
                'id' => $warehouse->id,
                'nik' => $warehouse->nik,
                'role' => $warehouse->role,
                'user_id' => $warehouse->user_id,
                'name' => $warehouse->name,
                'email' => $warehouse->user->email,
                'address' => $warehouse->address,
                'date_of_birth' => $warehouse->date_of_birth,
                'phone' => $warehouse->phone,
                'created_at' => $warehouse->created_at,
                'updated_at' => $warehouse->updated_at,
            ];
        }));

        // Merge the collections of doctors, cashiers, paramedis, and admins
        $users = $doctors->merge($cashiers)->merge($paramedis)->merge($admins)->merge($warehouse);

        // Pass the merged users data to the Inertia view
        return Inertia::render('Dashboard/Manager/Staff/Index', [
            'users' => $users,
        ]);
    }

    public function Apotek()
    {
        Cache::forget('medicines_list');

        // Menggunakan cache untuk meningkatkan performa query
        $medicines = Cache::remember('medicines_list', now()->addMinutes(10), function () {
            return Medicine::with(['pricing', 'batches'])->latest()->paginate(10);
        });

        return Inertia::render('Dashboard/Manager/Apotek/Index', [
            'medicines' => $medicines,
        ]);
    }

    public function transaction()
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
                'amount_paid' => 'Rp '.number_format($payment->amount_paid, 0, ',', '.'), // Format amount_paid as IDR
                'payment_method' => $payment->payment_method,
                'payment_by' => $payment->cashier->name ?? 'Tidak Diketahui', // Nama Cashier
            ];
        });

        // Kirim data ke frontend
        return Inertia::render('Dashboard/Manager/TransactionActivity/Index', [
            'patients' => $patients,
            'totalCashier' => $totalCashier,
            'totalPayment' => 'Rp '.$totalPayment, // Format total payment as IDR with "Rp" prefix
            'totalTransactions' => $totalTransactions,
            'paymentMethodsCount' => $paymentMethodsCount, // Add payment method count to the response
        ]);
    }

    // download pdf untuk aktivitas pemeriksaan
    public function generatePDFActivity()
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

        // Menyusun data yang akan dikirim ke view untuk PDF
        $data = [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
            'totalParamedis' => $totalParamedis,
        ];

        // Load view dengan data untuk di-render menjadi PDF
        $pdf = Pdf::loadView('pdf.activity.paramedis.activity', $data);

        // Download PDF
        return $pdf->download('activity_report.pdf');
    }

    public function generatePDFHealthCheck($id)
    {
        // Ambil data screening pasien beserta jawaban dan pemeriksaan fisik
        $screening = Patients::with(['answers.question', 'physicalExaminations.paramedis']) // Ambil data paramedis juga
            ->where('id', $id)
            ->firstOrFail(); // Pastikan pasien ditemukan

        // Ambil nama pasien untuk penamaan file PDF
        $patientName = str_replace(' ', '_', $screening->name); // Ganti spasi dengan underscore untuk nama file yang valid

        // Ambil data pemeriksaan fisik dan paramedis yang memeriksa
        $examinations = $screening->physicalExaminations;  // Mengambil semua pemeriksaan fisik yang terkait

        // Menyusun data untuk PDF
        $data = [
            'screening' => $screening,
            'examinations' => $examinations, // Kirim data pemeriksaan fisik
        ];

        // Mengonversi data menjadi PDF
        $pdf = PDF::loadView('pdf.activity.paramedis.health', $data);

        // Download PDF dengan nama yang sesuai
        return $pdf->download('health_check_'.$patientName.'.pdf');
    }

}
