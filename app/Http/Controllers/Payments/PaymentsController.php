<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Medicines\MedicineBatch;
use App\Models\Payments;
use App\Models\Users\Cashier;
use App\Models\Users\Patients;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Medicines\Medicine;
use App\Jobs\SendScreeningNotification;


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
        'payment_proof' => 'nullable|file|image|max:2048',
        'selected_medicine_id' => 'nullable|exists:medicines,id', // Ganti ke medicines table
        'medicine_batch_id' => 'nullable|exists:medicine_batches,id', // Tambahkan validasi batch
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

    // Log data yang diterima untuk debugging
    \Log::info('REQUEST ALL DATA:', $request->all());
    \Log::info('MEDICINE_QUANTITY FROM REQUEST:', ['medicine_quantity' => $request->input('medicine_quantity')]);
    \Log::info('DEBUG DATA', [
        'quantity_product' => $data['quantity_product'] ?? null,
        'selected_medicine_id' => $data['selected_medicine_id'] ?? null,
        'medicine_batch_id' => $data['medicine_batch_id'] ?? null,
        'all_data' => $data,
    ]);

    // Jika ada file bukti pembayaran, simpan file tersebut
    if ($request->hasFile('payment_proof')) {
        $data['payment_proof'] = $request->file('payment_proof')->store('payment_proofs', 'public');
    }

    // Menambahkan status pembayaran otomatis menjadi 1 (terbayar) jika belum ada
    $data['payment_status'] = 1;

    // Proses pengurangan stok obat SEBELUM menyimpan pembayaran
    if (isset($data['quantity_product']) && $data['quantity_product'] > 0 && !empty($data['medicine_batch_id'])) {
        \Log::info('PROCESSING MEDICINE STOCK REDUCTION', [
            'quantity_product' => $data['quantity_product'],
            'medicine_batch_id' => $data['medicine_batch_id']
        ]);
        try {
            // Cari batch berdasarkan medicine_batch_id
            $batch = \App\Models\Medicines\MedicineBatch::findOrFail($data['medicine_batch_id']);
            \Log::info('BATCH FOUND', [
                'batch_id' => $batch->id,
                'batch_number' => $batch->batch_number,
                'current_quantity' => $batch->quantity
            ]);
            // Cek apakah stok mencukupi dan kurangi stok
            $oldBatchQty = $batch->quantity;
            if ($batch->deductStock($data['quantity_product'])) {
                // Kurangi stok utama juga
                $medicine = $batch->medicine;
                if ($medicine) {
                    $medicine->deductStock($data['quantity_product']);
                }
                \Log::info('BATCH STOCK REDUCED SUCCESSFULLY', [
                    'batch_id' => $batch->id,
                    'batch_number' => $batch->batch_number,
                    'old_quantity' => $oldBatchQty,
                    'new_quantity' => $batch->quantity,
                    'reduced_by' => $data['quantity_product']
                ]);
            } else {
                \Log::error('INSUFFICIENT BATCH STOCK', [
                    'batch_id' => $batch->id,
                    'required' => $data['quantity_product'],
                    'available' => $batch->quantity
                ]);
                return redirect()->back()->withErrors([
                    'quantity_product' => "Stok batch tidak mencukupi. Stok tersedia: {$batch->quantity}"
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('ERROR REDUCING BATCH STOCK', [
                'error' => $e->getMessage(),
                'medicine_batch_id' => $data['medicine_batch_id']
            ]);
            return redirect()->back()->withErrors([
                'quantity_product' => 'Terjadi error saat memproses stok batch: ' . $e->getMessage()
            ]);
        }
    } else {
        \Log::info('NO MEDICINE STOCK REDUCTION', [
            'quantity_product' => $data['quantity_product'] ?? 'null',
            'medicine_batch_id' => $data['medicine_batch_id'] ?? 'null',
            'reason' => !isset($data['quantity_product']) ? 'quantity_product not set' : 
                       ($data['quantity_product'] <= 0 ? 'quantity_product <= 0' : 'medicine_batch_id empty')
        ]);
    }

    // Membuat data pembayaran setelah stok berhasil dikurangi
    try {
        $payment = Payments::create($data); // medicine_batch_id akan ikut tersimpan jika ada kolomnya di tabel
        \Log::info('PAYMENT CREATED', [
            'payment_id' => $payment->id,
            'quantity_product' => $payment->quantity_product,
            'medicine_batch_id' => $payment->medicine_batch_id,
            'selected_medicine_id' => $payment->selected_medicine_id
        ]);
    } catch (\Exception $e) {
        \Log::error('ERROR CREATING PAYMENT', ['error' => $e->getMessage()]);
        return redirect()->back()->withErrors(['payment' => 'Terjadi error saat menyimpan pembayaran.']);
    }

    // Update status pembayaran pasien jika pembayaran selesai
    try {
        Patients::where('id', $data['patient_id'])->update(['payment_status' => 'completed']);
        \Log::info('PATIENT STATUS UPDATED', ['patient_id' => $data['patient_id']]);
        
        // Dispatch notification
        $patient = \App\Models\Users\Patients::find($data['patient_id']);
        SendScreeningNotification::dispatch($patient);
        \Log::info('SCREENING NOTIFICATION DISPATCHED', ['patient_id' => $data['patient_id']]);
    } catch (\Exception $e) {
        \Log::error('ERROR UPDATING PATIENT STATUS OR DISPATCHING NOTIFICATION', ['error' => $e->getMessage()]);
    }

    \Log::info('PAYMENT PROCESS COMPLETED SUCCESSFULLY');
    
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
        return $pdf->download('nota_pembayaran_'.$payment->no_transaction.'.pdf');
    }
}
