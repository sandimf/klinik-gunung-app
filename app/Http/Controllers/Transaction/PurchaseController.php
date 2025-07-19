<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        $products = Product::get();

        return Inertia::render('Dashboard/Cashier/Transaction/Index', [
            'products' => $products,
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
                if (! $product || $product->stock < $item['quantity']) {
                    DB::rollBack();

                    // Untuk Inertia request, kirim flash message
                    if ($request->expectsJson() || $request->header('X-Inertia')) {
                        return back()->with('error', 'Stok tidak tersedia untuk '.$product->name);
                    }

                    return redirect()->back()->with('error', 'Stok tidak tersedia untuk '.$product->name);
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

            // Untuk Inertia request, kirim flash message
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return back()->with('success', 'Berhasil Melakukan Checkout');
            }

            // Redirect dengan pesan sukses
            return redirect()->back()->with('success', 'Berhasil Melakukan Checkout');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return back()->with('error', 'Gagal checkout. Silakan coba lagi.');
            }

            return redirect()->back()->with('error', 'Gagal checkout. Silakan coba lagi.');
        }
    }

    public function history(Request $request)
    {
        $page = max(1, (int) filter_var($request->input('page', 1), FILTER_VALIDATE_INT, [
            'options' => [
                'default' => 1,
                'min_range' => 1,
            ],
        ]));
        $perPage = 10;
        $search = $request->input('search');
        if ($search !== null) {
            $search = filter_var($search, FILTER_SANITIZE_STRING);
            $search = trim(strip_tags($search));
        }

        // Ambil transaksi produk
        $productQuery = \App\Models\Transaction\Transaction::orderBy('created_at', 'desc');
        $productTransactions = [];
        if (!empty($search)) {
            $productQuery->whereRaw('JSON_SEARCH(items_details, "all", ?) IS NOT NULL', ["%$search%"]);
        }
        $productPaginated = $productQuery->paginate($perPage, ['*'], 'page', $page);
        foreach ($productPaginated as $transaction) {
            $items = json_decode($transaction->items_details, true);
            foreach ($items as &$item) {
                $product = \App\Models\Product::find($item['item_id']);
                $item['product_name'] = $product ? $product->name : null;
            }
            $productTransactions[] = [
                'id' => $transaction->id,
                'no_transaction' => $transaction->id,
                'payment_method' => $transaction->payment_method,
                'payment_proof' => $transaction->payment_proof,
                'total_price' => $transaction->total_price,
                'items_details' => $items,
                'type' => 'product',
                'created_at' => $transaction->created_at,
                'patient_name' => null,
            ];
        }

        // Ambil transaksi screening
        $paymentQuery = \App\Models\Payments::with(['items', 'patient'])->orderBy('created_at', 'desc');
        if (!empty($search)) {
            $paymentQuery->whereHas('patient', function($q) use ($search) {
                $q->where('name', 'like', "%$search%") ;
            });
        }
        $paymentPaginated = $paymentQuery->paginate($perPage, ['*'], 'page', $page);
        $paymentTransactions = [];
        foreach ($paymentPaginated as $payment) {
            $items = $payment->items->map(function ($item) {
                return [
                    'item_id' => $item->item_id,
                    'item_type' => $item->item_type,
                    'product_name' => $item->item_type === 'other' ? $item->item_name : null,
                    'medicine_name' => $item->item_type === 'medicine' ? $item->item_name : null,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ];
            });
            $paymentTransactions[] = [
                'id' => $payment->id,
                'no_transaction' => $payment->no_transaction,
                'payment_method' => $payment->payment_method,
                'payment_proof' => $payment->payment_proof,
                'total_price' => $payment->amount_paid,
                'items_details' => $items,
                'type' => 'screening',
                'created_at' => $payment->created_at,
                'patient_name' => $payment->patient ? $payment->patient->name : null,
            ];
        }

        // Gabungkan dan paginasi manual hasilnya
        $allTransactions = collect($productTransactions)->merge($paymentTransactions)->sortByDesc('created_at')->values();
        $total = $productPaginated->total() + $paymentPaginated->total();
        $from = ($page - 1) * $perPage + 1;
        $to = $from + $allTransactions->count() - 1;
        $pagination = [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => ceil($total / $perPage),
            'from' => $from,
            'to' => $to,
            'prev_page_url' => $page > 1 ? url()->current() . '?page=' . ($page - 1) . ($search ? '&search=' . urlencode($search) : '') : null,
            'next_page_url' => $to < $total ? url()->current() . '?page=' . ($page + 1) . ($search ? '&search=' . urlencode($search) : '') : null,
        ];

        return Inertia::render('Dashboard/Cashier/Transaction/History', [
            'transactions' => [
                'data' => $allTransactions,
                ...$pagination,
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
