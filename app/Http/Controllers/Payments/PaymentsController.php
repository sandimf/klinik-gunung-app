<?php

namespace App\Http\Controllers\Payments;

use App\Models\Payments;

use Illuminate\Http\Request;
use App\Models\Users\Patients;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Medicines\MedicineBatch;

class PaymentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Ambil ID kasir dari user yang sedang login
        $cashierId = Auth::user()->cashier->id;  // Mengambil cashier_id yang terkait dengan user yang sedang login

        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'quantity_product' => 'nullable|integer|min:1',
            'price_product' => 'nullable|numeric|min:0',
            'payment_proof' => 'nullable|file|image|max:2048',
            'medicine_batch_id' => 'nullable|exists:medicine_batches,id',
        ]);

        // Menyiapkan data untuk disimpan
        $data = $request->all();

        // Menambahkan cashier_id yang merupakan ID kasir yang sedang login
        $data['cashier_id'] = $cashierId;

        // Jika ada file bukti pembayaran, simpan file tersebut
        if ($request->hasFile('payment_proof')) {
            $data['payment_proof'] = $request->file('payment_proof')->store('payment_proofs', 'public');
        }

        // Menambahkan status pembayaran otomatis menjadi 1 (terbayar) jika belum ada
        $data['payment_status'] = 1;

        // Membuat data pembayaran
        $payment = Payments::create($data);

        // Update status pembayaran pasien jika pembayaran selesai
        Patients::where('id', $data['patient_id'])->update(['payment_status' => "completed"]);

        // Jika ada produk yang dibeli, kurangi stok pada batch yang terkait
        if (!empty($data['quantity_product']) && !empty($data['medicine_batch_id'])) {
            $batch = MedicineBatch::findOrFail($data['medicine_batch_id']);
            if ($batch->quantity >= $data['quantity_product']) {
                $batch->quantity -= $data['quantity_product'];
                $batch->save();
            } else {
                // Jika stok tidak mencukupi, kembalikan pesan error
                return redirect()->back()->withErrors(['quantity_product' => 'Stok tidak mencukupi untuk batch obat yang dipilih.']);
            }
        }

        // Mengarahkan kembali dengan pesan sukses
        return redirect()->route('payments.index')->with('success', 'Pembayaran berhasil diproses.');
    }




    /**
     * Display the specified resource.
     */
    public function show(Payments $payments)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payments $payments)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payments $payments)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payments $payments)
    {
        //
    }
}
