<?php

namespace App\Http\Controllers\Transaction;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Transaction\Transaction;

class PurchaseController extends Controller
{

    public function index()
    {
        $products = Product::get();

        return Inertia::render("Dashboard/Cashier/Transaction/Index", [
            'products' => $products
        ]);
    }


    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,transfer,qris',
            'payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048', // Optional jika ada bukti pembayaran
        ]);
    
        DB::beginTransaction();
    
        try {
            $cartItems = $request->input('items');
            $paymentMethod = $request->input('payment_method');
            $paymentProofPath = null;
    
            // Upload bukti pembayaran jika ada
            if ($request->hasFile('payment_proof')) {
                $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'public');
            }
    
            $totalPrice = 0;
            $itemsDetails = [];
    
            // Loop untuk memproses setiap item yang dibeli
            foreach ($cartItems as $item) {
                $product = Product::find($item['id']);
    
                // Cek apakah stok tersedia
                if (!$product || $product->stock < $item['quantity']) {
                    DB::rollBack();
                    return redirect()->back()->with(['error' => 'Stok tidak tersedia untuk ' . $product->name]);
                }
    
                // Hitung harga total untuk item
                $itemTotal = $product->price * $item['quantity'];
                $totalPrice += $itemTotal;
    
                // Simpan detail item dalam array
                $itemsDetails[] = [
                    'item_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'total_price' => $itemTotal,
                ];
    
                // Kurangi stok produk
                $product->decrement('stock', $item['quantity']);
            }
    
            // Buat transaksi utama
            $transaction = Transaction::create([
                'total_price' => $totalPrice,
                'payment_method' => $paymentMethod,
                'payment_proof' => $paymentProofPath,  // Simpan path bukti pembayaran
                'items_details' => json_encode($itemsDetails), // Simpan detail item dalam format JSON
            ]);
    
            DB::commit();
    
            // Redirect dengan pesan sukses
            return redirect()->back()->with('message', 'Berhasil Melakukan Checkout');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal checkout. Silakan coba lagi.']);
        }
    }
    
    

    public function history()
    {
        // Ambil transaksi dan termasuk detail items terkait
        $transactions = Transaction::orderBy('created_at', 'desc')->paginate(10);
    
        // Memasukkan nama produk ke dalam items_details
        foreach ($transactions as $transaction) {
            // Meng-decode JSON dari items_details
            $items = json_decode($transaction->items_details, true);
    
            // Tambahkan nama produk ke setiap item
            foreach ($items as &$item) {
                $product = Product::find($item['item_id']);
                if ($product) {
                    // Menambahkan nama produk pada setiap item
                    $item['product_name'] = $product->name;
                }
            }
    
            // Update kembali items_details dengan nama produk
            $transaction->items_details = $items;
        }
    
        return Inertia::render("Dashboard/Cashier/Transaction/History", [
            'transactions' => $transactions,
        ]);
    }
    

    
    
}
