<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Medicines\MedicineBatch;
use App\Models\Payments;
use App\Models\Users\Cashier;
use App\Models\Users\Patients;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PaymentsController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'cashier_id' => 'required|exists:cashiers,id',
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

        // Jika ada file bukti pembayaran, simpan file tersebut
        if ($request->hasFile('payment_proof')) {
            $data['payment_proof'] = $request->file('payment_proof')->store('payment_proofs', 'public');
        }

        // Menambahkan status pembayaran otomatis menjadi 1 (terbayar) jika belum ada
        $data['payment_status'] = 1;

        // Membuat data pembayaran
        $payment = Payments::create($data);

        // Update status pembayaran pasien jika pembayaran selesai
        Patients::where('id', $data['patient_id'])->update(['payment_status' => 'completed']);

        // Jika ada produk yang dibeli, kurangi stok pada batch yang terkait
        if (! empty($data['quantity_product']) && ! empty($data['medicine_batch_id'])) {
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
        return redirect()->route('cashier.screening')->with('success', 'Pembayaran berhasil diproses.');
    }

    public function generateNota($noTransaction)
    {
        // Ambil data pembayaran berdasarkan nomor transaksi
        $payment = Payments::where('no_transaction', $noTransaction)->firstOrFail();

        // Ambil data pasien berdasarkan patient_id
        $patient = Patients::findOrFail($payment->patient_id);

        // Ambil data kasir berdasarkan cashier_id
        $cashier = Cashier::findOrFail($payment->cashier_id);

        // Jika ada produk yang dibeli, ambil informasi produk dan batch
        $product = null;
        if ($payment->quantity_product && $payment->medicine_batch_id) {
            $product = MedicineBatch::findOrFail($payment->medicine_batch_id);
        }

        // Membuat tampilan nota
        $pdf = Pdf::loadView('pdf.nota', [
            'payment' => $payment,
            'patient' => $patient,
            'cashier' => $cashier,
            'product' => $product,
        ]);

        // Mengunduh PDF dengan nama file "nota_pembayaran.pdf"
        return $pdf->download('nota_pembayaran_' . $payment->no_transaction . '.pdf');
    }
}
