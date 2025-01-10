<?php

namespace App\Http\Controllers\Users;

use Inertia\Inertia;
use App\Models\Payments;
use App\Models\Users\Admin;
use App\Models\Users\Doctor;
use Illuminate\Http\Request;
use App\Models\Users\Cashier;
use App\Models\Users\Patients;
use Illuminate\Support\Carbon;
use App\Models\Users\Paramedis;
use App\Models\Medicines\Medicine;
use App\Http\Controllers\Controller;
use App\Models\Users\PatientsOnline;
use Illuminate\Support\Facades\Cache;

class ManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Dashboard/Manager/Index');
    }

    public function profile()
    {
        return Inertia::render('Profile/Manager');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function screening()
    {
        // Query screenings from Patients model (Offline)
        $offlineScreenings = Patients::with(['answers.question', 'physicalExaminations.paramedis', 'physicalExaminations.doctor'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->get();

        // Query screenings from PatientsOnline model (Online)
        $onlineScreenings = PatientsOnline::with(['answers.question', 'physicalExaminations.paramedis', 'physicalExaminations.doctor'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'completed')
            ->get();

        // Gabungkan data screening offline dan online ke dalam satu koleksi
        $screenings = collect([])->merge($offlineScreenings)->merge($onlineScreenings);
        return Inertia::render('Dashboard/Manager/Screenings/Index', [
            'screenings' => $screenings->all(),
        ]);
    }

    // List Staff
    public function MedicalPersonel()
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

        // Merge the collections of doctors, cashiers, paramedis, and admins
        $users = $doctors->merge($cashiers)->merge($paramedis)->merge($admins);

        // Pass the merged users data to the Inertia view
        return Inertia::render('Dashboard/Manager/MedicalPersonel/Index', [
            'users' => $users,
        ]);
    }

    // Mendapatkan Report mingguan bulanan 
    public function Report(Request $request)
    {
        // Mendapatkan jenis laporan: daily, weekly, atau monthly
        $filterType = $request->get('type', 'daily'); // Default daily

        // Menentukan rentang tanggal
        $startDate = now()->startOfDay();
        $endDate = now()->endOfDay();

        if ($filterType === 'weekly') {
            $startDate = now()->startOfWeek();
            $endDate = now()->endOfWeek();
        } elseif ($filterType === 'monthly') {
            $startDate = now()->startOfMonth();
            $endDate = now()->endOfMonth();
        }

        // Query untuk screening offline (dari tabel Patients)
        $offlineScreenings = Patients::with(['answers.question', 'physicalExaminations.paramedis', 'physicalExaminations.doctor'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($screening) {
                $screening->formatted_date = Carbon::parse($screening->created_at)->translatedFormat('d F Y');
                return $screening;
            });

        // Query untuk screening online (dari tabel PatientsOnline)
        $onlineScreenings = PatientsOnline::with(['answers.question', 'physicalExaminations.paramedis', 'physicalExaminations.doctor'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($screening) {
                $screening->formatted_date = Carbon::parse($screening->created_at)->translatedFormat('d F Y');
                return $screening;
            });

        // Gabungkan screening offline dan online
        $screenings = collect([])->merge($offlineScreenings)->merge($onlineScreenings);

        // Mengambil total pemasukan dari tabel payments
        $totalIncome = Payments::whereBetween('created_at', [$startDate, $endDate])
            ->sum('amount_paid'); // Jumlah pembayaran

        return Inertia::render('Dashboard/Manager/Report/Index', [
            'reports' => [
                'screenings' => $screenings,
                'totalIncome' => $totalIncome,
            ],
            'filterType' => $filterType,
        ]);
    }


    public function Apotek()
    {
        Cache::forget('medicines_list');

        // Menggunakan cache untuk meningkatkan performa query
        $medicines = Cache::remember('medicines_list', now()->addMinutes(10), function () {
            return Medicine::with(['pricing', 'batches'])->latest()->paginate(10);
        });

        // Menghitung jumlah total obat di seluruh batch
        $totalQuantity = Medicine::with('batches')  // Ambil semua obat dan relasinya ke batches
            ->get()  // Ambil seluruh data medicine
            ->sum(function ($medicine) {
                return $medicine->batches->sum('quantity');  // Menjumlahkan quantity dari seluruh batch
            });

        return Inertia::render('Dashboard/Manager/Apotek/Index', [
            'medicines' => $medicines,
            'totalQuantity' => $totalQuantity,  // Mengirimkan jumlah total obat
        ]);
    }

    public function Office()
    {
        // Ambil semua pembayaran yang berhasil, dan juga data pasien serta informasi lainnya
        $payments = Payments::with(['patient.user', 'medicineBatch'])  // Menyertakan hubungan dengan model Patient dan User
            ->where('payment_status', true)  // Hanya pembayaran berhasil
            ->select('amount_paid', 'created_at', 'patient_id', 'medicine_batch_id', 'quantity_product')  // Ambil kolom yang diperlukan
            ->orderBy('created_at', 'desc')  // Urutkan berdasarkan tanggal terbaru
            ->get();

        // Hitung total pemasukan
        $totalIncome = $payments->sum('amount_paid');

        // Hitung jumlah transaksi yang berhasil
        $successfulTransactions = $payments->count();

        // Dapatkan tanggal pembayaran terbaru dalam zona waktu Asia/Jakarta
        $lastPaymentDate = $payments->isNotEmpty()
            ? Carbon::parse($payments->first()->created_at)
            ->timezone('Asia/Jakarta') // Mengatur zona waktu
            ->translatedFormat('j F Y') // Format tanggal: 7 January 2025
            : null;

        // Format data untuk setiap pembayaran yang berhasil dan menampilkan informasi tambahan (misal: nama pasien dan detail pembelian)
        $paymentsDetails = $payments->take(3)->map(function ($payment) {
            $payment->formatted_date = Carbon::parse($payment->created_at)
                ->timezone('Asia/Jakarta')
                ->translatedFormat('j F Y'); // Format tanggal transaksi

            // Ambil nama pasien dan obat jika tersedia
            $payment->patient_name = $payment->patient ? $payment->patient->name : 'Tidak diketahui';
            $payment->medicine_details = $payment->medicineBatch ? $payment->medicineBatch->name : 'Obat tidak tersedia';

            // Jika ada informasi jumlah obat yang dibeli, sertakan dalam detail
            $payment->quantity_details = $payment->quantity_product ? $payment->quantity_product : 'Jumlah tidak tersedia';

            // Menghitung pemasukan dari pembelian obat
            $payment->medicine_income = $payment->medicineBatch ? $payment->medicineBatch->price * $payment->quantity_product : 0;

            // Ambil avatar pengguna dari relasi user
            $payment->patient_avatar = $payment->patient && $payment->patient->user ? $payment->patient->user->avatar : 'default-avatar.jpg';  // Default jika tidak ada avatar

            return $payment;
        });

        // Hitung total pemasukan dari obat (medicine_income)
        $totalMedicineIncome = $paymentsDetails->sum('medicine_income');  // Menghitung total pemasukan obat

        // Kirim data ke view
        return Inertia::render('Dashboard/Manager/Office/Index', [
            'totalIncome' => $totalIncome,  // Total pemasukan
            'totalMedicineIncome' => $totalMedicineIncome,  // Total pemasukan dari obat
            'lastPaymentDate' => $lastPaymentDate,  // Tanggal transaksi terbaru
            'successfulTransactions' => $successfulTransactions,  // Jumlah transaksi berhasil
            'paymentsDetails' => $paymentsDetails,  // Informasi detail pembayaran
        ]);
    }
}
