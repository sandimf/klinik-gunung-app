<?php

namespace App\Http\Controllers\Roles\Cashier\Payments;

use App\Models\Payments;
use Illuminate\Http\Request;
use App\Models\Users\Cashier;
use App\Models\Users\Patients;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Jobs\SendScreeningNotification;
use App\Models\Medicines\MedicineBatch;

class ScreeningPaymentsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'cashier_id' => 'required|exists:cashiers,id',
            'patient_id' => 'required|exists:patients,id',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'quantity_product' => 'nullable|integer|min:1',
            'payment_proof' => 'nullable|file|image|max:2048',
            'selected_medicine_id' => 'nullable|exists:medicines,id',
            'medicine_batch_id' => 'nullable|exists:medicine_batches,id',
            'selectedOptions' => 'nullable|array',
        ]);

        // Menyiapkan data untuk disimpan
        $data = $request->only([
            'cashier_id',
            'patient_id',
            'payment_method',
            'amount_paid',
            'payment_proof',
            'selectedOptions',
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
        if (isset($data['quantity_product']) && $data['quantity_product'] > 0 && !empty($data['medicine_batch_id'])) {
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
                        'quantity_product' => "Stok batch tidak mencukupi. Stok tersedia: {$batch->quantity}"
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->withErrors([
                    'quantity_product' => 'Terjadi error saat memproses stok batch: ' . $e->getMessage()
                ]);
            }
        }

        // Membuat data pembayaran setelah stok berhasil dikurangi
        try {
            $payment = Payments::create($data);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['payment' => 'Terjadi error saat menyimpan pembayaran.']);
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
