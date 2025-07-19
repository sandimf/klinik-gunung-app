<?php

namespace App\Http\Controllers\Roles\Cashier\Payments;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cashier\ScreeningPaymentsRequest;
use App\Jobs\SendScreeningNotification;
use App\Models\Medicines\Medicine;
use App\Models\Medicines\MedicineBatch;
use App\Models\PaymentItem;
use App\Models\Payments;
use App\Models\Roles\Admin\Management\AmountScreening;
use App\Models\Users\Cashier;
use App\Models\Users\Patients;
use Barryvdh\DomPDF\Facade\Pdf;

class ScreeningPaymentsController extends Controller
{
    public function store(ScreeningPaymentsRequest $request)
    {
        // Cek apakah sudah ada pembayaran untuk patient_id ini di tabel payments
        $existingPayment = Payments::where('patient_id', $request->input('patient_id'))
            ->where('payment_status', 1)
            ->first();
        if ($existingPayment) {
            return redirect()->back()->withErrors(['payment' => 'Pasien sudah melakukan pembayaran.']);
        }
        // Cek apakah pasien sudah membayar (dari tabel patients)
        $patient = Patients::find($request->input('patient_id'));
        if ($patient && $patient->payment_status === 'completed') {
            return redirect()->back()->withErrors(['payment' => 'Pasien sudah melakukan pembayaran.']);
        }

        // Menyiapkan data untuk disimpan
        $data = $request->only([
            'cashier_id',
            'patient_id',
            'payment_method',
            'amount_paid',
            'payment_proof',
            'selected_medicine_id',
            'medicine_batch_id',
        ]);

        // Ambil quantity_product dari medicine_quantity jika ada
        $data['quantity_product'] = $request->input('medicine_quantity');

        // Jika ada file bukti pembayaran, simpan file tersebut
        if ($request->hasFile('payment_proof')) {
            $data['payment_proof'] = $request->file('payment_proof')->store('payment_proofs', 'public');
        }

        // Menambahkan status pembayaran otomatis menjadi 1 (terbayar)
        $data['payment_status'] = 1;

        // Proses pengurangan stok obat SEBELUM menyimpan pembayaran
        if (isset($data['quantity_product']) && $data['quantity_product'] > 0 && ! empty($data['medicine_batch_id'])) {
            try {
                // Cari batch berdasarkan medicine_batch_id
                $batch = MedicineBatch::findOrFail($data['medicine_batch_id']);

                // Cek apakah stok mencukupi dan kurangi stok
                if ($batch->deductStock($data['quantity_product'])) {
                    // Kurangi stok utama juga
                    $medicine = $batch->medicine;
                    if ($medicine) {
                        $medicine->deductStock($data['quantity_product']);
                    }
                } else {
                    return redirect()->back()->withErrors([
                        'quantity_product' => "Stok batch tidak mencukupi. Stok tersedia: {$batch->quantity}",
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->withErrors([
                    'quantity_product' => 'Terjadi error saat memproses stok batch: '.$e->getMessage(),
                ]);
            }
        }

        // Membuat data pembayaran setelah stok berhasil dikurangi
        try {
            $payment = Payments::create($data);
        } catch (\Exception $e) {
            // \Log::error('Error saat menyimpan pembayaran: ' . $e->getMessage());
            return redirect()->back()->withErrors(['payment' => 'Terjadi error saat menyimpan pembayaran.']);
        }

        // Simpan layanan (service) yang dipilih
        $selectedOptions = $request->input('selectedOptions', []);
        foreach ($selectedOptions as $option) {
            // Jika value adalah ID amount_screening
            $amount = AmountScreening::find($option);
            if ($amount) {
                PaymentItem::create([
                    'payment_id' => $payment->id,
                    'item_type' => 'service',
                    'item_id' => $amount->id,
                    'item_name' => $amount->type,
                    'quantity' => 1,
                    'price' => $amount->amount,
                    'total' => $amount->amount,
                ]);
            }
        }

        // Simpan obat
        if ($request->filled('selected_medicine_id') && $request->filled('medicine_quantity')) {
            $medicine = Medicine::find($request->input('selected_medicine_id'));
            if ($medicine) {
                $qty = (int) $request->input('medicine_quantity');
                $price = $medicine->pricing->otc_price ?? 0;
                PaymentItem::create([
                    'payment_id' => $payment->id,
                    'item_type' => 'medicine',
                    'item_id' => $medicine->id,
                    'item_name' => $medicine->medicine_name,
                    'quantity' => $qty,
                    'price' => $price,
                    'total' => $price * $qty,
                ]);
            }
        }

        // Simpan produk
        $selectedProducts = $request->input('selected_products', []);
        foreach ($selectedProducts as $prod) {
            $product = \App\Models\Product::find($prod['product_id']);
            if ($product) {
                $qty = (int) $prod['quantity'];
                $price = $product->price;
                \App\Models\PaymentItem::create([
                    'payment_id' => $payment->id,
                    'item_type' => 'other', // Ubah dari 'product' ke 'other'
                    'item_id' => $product->id,
                    'item_name' => $product->name,
                    'quantity' => $qty,
                    'price' => $price,
                    'total' => $price * $qty,
                ]);
                // Kurangi stok produk
                $product->decrement('stock', $qty);
            }
        }

        // Update status pembayaran pasien jika pembayaran selesai
        try {
            Patients::where('id', $data['patient_id'])->update(['payment_status' => 'completed']);

            // Dispatch notification
            $patient = Patients::find($data['patient_id']);
            SendScreeningNotification::dispatch($patient);
        } catch (\Exception $e) {
            // Silent fail untuk notification
        }

        // Mengarahkan kembali dengan pesan sukses

       return back()->with('success', 'Pembayaran berhasil diproses.');

    }
    public function generateNota($noTransaction)
    {
        // Log the transaction number we're looking for
        \Log::info('Generating nota for transaction:', ['no_transaction' => $noTransaction]);

        // Get the payment with items
        $payment = Payments::with(['items' => function ($query) {
            $query->orderBy('item_type')->orderBy('id');
        }])
            ->where('no_transaction', $noTransaction)
            ->firstOrFail();

        // Log payment details
        \Log::info('Payment found:', [
            'id' => $payment->id,
            'no_transaction' => $payment->no_transaction,
            'patient_id' => $payment->patient_id,
            'created_at' => $payment->created_at,
        ]);

        // Check if items relation is loaded
        if ($payment->relationLoaded('items')) {
            \Log::info('Items relation is loaded');
            $itemsCount = $payment->items->count();
            \Log::info('Payment Items Count:', ['count' => $itemsCount]);

            if ($itemsCount === 0) {
                // If no items, check if they exist in the database
                $dbItems = \DB::table('payment_items')
                    ->where('payment_id', $payment->id)
                    ->get();

                \Log::info('Items from database query:', ['items' => $dbItems->toArray()]);

                // If we found items in the DB but not in the relation, something's wrong with the relationship
                if ($dbItems->isNotEmpty()) {
                    \Log::warning('Items exist in database but not in relation. Relationship might be broken.');
                    // Manually create items collection from DB results
                    $payment->setRelation('items', $dbItems->map(function ($item) {
                        return new \App\Models\PaymentItem((array) $item);
                    }));
                }
            }
        } else {
            \Log::warning('Items relation is NOT loaded. Loading manually...');
            $payment->load(['items' => function ($query) {
                $query->orderBy('item_type')->orderBy('id');
            }]);
            \Log::info('Items loaded manually. Count:', ['count' => $payment->items->count()]);
        }

        // Final check of items
        $finalItems = $payment->items->map(function ($item) {
            return [
                'id' => $item->id,
                'payment_id' => $item->payment_id,
                'item_type' => $item->item_type,
                'item_name' => $item->item_name,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'total' => $item->total,
            ];
        });
        \Log::info('Final payment items:', ['items' => $finalItems->toArray()]);

        // Ambil data pasien berdasarkan patient_id
        $patient = Patients::findOrFail($payment->patient_id);

        // Ambil data kasir berdasarkan cashier_id
        $cashier = Cashier::findOrFail($payment->cashier_id);

        // Kelompokkan item pembayaran berdasarkan tipe
        $groupedItems = [
            'services' => [],
            'medicines' => [],
            'products' => [],
        ];
        // Hitung total untuk setiap kelompok
        $totals = [
            'services' => 0,
            'medicines' => 0,
            'products' => 0,
            'grand_total' => 0,
        ];
        // Proses setiap item pembayaran
        foreach ($payment->items as $item) {
            if ($item->item_type === 'service') {
                $groupedItems['services'][] = [
                    'id' => $item->id,
                    'item_name' => $item->item_name,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'total' => $item->total,
                ];
                $totals['services'] += $item->total;
            } elseif ($item->item_type === 'medicine') {
                $groupedItems['medicines'][] = [
                    'id' => $item->id,
                    'item_name' => $item->item_name,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'total' => $item->total,
                ];
                $totals['medicines'] += $item->total;
            } elseif ($item->item_type === 'other') { // <--- harusnya 'other'
                $groupedItems['products'][] = [
                    'id' => $item->id,
                    'item_name' => $item->item_name,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'total' => $item->total,
                ];
                $totals['products'] += $item->total;
            }
            // Debug: Log each item
            \Log::info('Processing item:', [
                'id' => $item->id,
                'type' => $item->item_type,
                'name' => $item->item_name,
                'price' => $item->price,
                'quantity' => $item->quantity,
                'total' => $item->total,
            ]);
        }
        // Debug: Log grouped items and totals
        \Log::info('Grouped Items:', $groupedItems);
        \Log::info('Totals:', $totals);
        // Hitung grand total
        $totals['grand_total'] = $totals['services'] + $totals['medicines'] + $totals['products'];

        // Jika ada produk yang dibeli, ambil informasi produk dan batch
        $product = null;
        if ($payment->quantity_product && $payment->medicine_batch_id) {
            $product = MedicineBatch::with('medicine')->findOrFail($payment->medicine_batch_id);
        }

        // Membuat tampilan nota
        $pdf = Pdf::loadView('pdf.nota', [
            'payment' => $payment,
            'patient' => $patient,
            'cashier' => $cashier,
            'product' => $product,
            'groupedItems' => $groupedItems,
            'totals' => $totals,
        ])->setPaper('A5');

        // Mengunduh PDF dengan nama file "nota_pembayaran_[no_transaksi].pdf"
        return $pdf->download('nota_pembayaran_'.$payment->no_transaction.'.pdf');
    }
}
