<?php

namespace App\Http\Controllers\Clinic;

use Inertia\Inertia;
use App\Models\Payments;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;

class OfficeController extends Controller
{

    public function index()
{
    // Ambil semua pembayaran yang berhasil
    $payments = Payments::where('payment_status', true) // Hanya pembayaran berhasil
        ->select('amount_paid', 'created_at') // Ambil kolom yang diperlukan
        ->orderBy('created_at', 'desc') // Urutkan berdasarkan tanggal terbaru
        ->get();
    
    // Hitung total pemasukan
    $totalIncome = $payments->sum('amount_paid'); 

    // Hitung jumlah transaksi yang berhasil
    $successfulTransactions = $payments->count(); 

    // Dapatkan tanggal pembayaran terbaru dalam zona waktu Asia/Jakarta
    $lastPaymentDate = $payments->isNotEmpty() 
        ? Carbon::parse($payments->first()->created_at)->timezone('Asia/Jakarta')->toDateTimeString() 
        : null;

    // Kirim data ke view
    return Inertia::render('Dashboard/Cashier/Office/Index', [
        'totalIncome' => $totalIncome,               // Total pemasukan
        'lastPaymentDate' => $lastPaymentDate,       // Tanggal transaksi terbaru (WIB)
        'successfulTransactions' => $successfulTransactions, // Jumlah transaksi berhasil
    ]);
}
    
    
    
}
