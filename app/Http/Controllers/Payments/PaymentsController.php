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
        'selectedOptions' => 'nullable|array',
    ]);

    // Menyiapkan data untuk disimpan
    $data = $request->all();

    // Log data yang diterima untuk debugging
    \Log::info('DATA RECEIVED:', $data);

    // Jika ada file bukti pembayaran, simpan file tersebut
    if ($request->hasFile('payment_proof')) {
        $data['payment_proof'] = $request->file('payment_proof')->store('payment_proofs', 'public');
    }

    // Menambahkan status pembayaran otomatis menjadi 1 (terbayar) jika belum ada
    $data['payment_status'] = 1;

    // Proses pengurangan stok obat SEBELUM menyimpan pembayaran
    if (!empty($data['quantity_product']) && !empty($data['selected_medicine_id'])) {
        \Log::info('PROCESSING MEDICINE STOCK REDUCTION', [
            'quantity_product' => $data['quantity_product'],
            'selected_medicine_id' => $data['selected_medicine_id']
        ]);
        
        try {
            // Cari medicine berdasarkan selected_medicine_id
            $medicine = \App\Models\Medicines\Medicine::findOrFail($data['selected_medicine_id']);
            \Log::info('MEDICINE FOUND', [
                'medicine_name' => $medicine->medicine_name,
                'current_quantity' => $medicine->quantity
            ]);
            
            // Cek apakah stok mencukupi
            if ($medicine->quantity >= $data['quantity_product']) {
                $oldQuantity = $medicine->quantity;
                $medicine->quantity -= $data['quantity_product'];
                $medicine->save();
                
                \Log::info('STOCK REDUCED SUCCESSFULLY', [
                    'medicine_name' => $medicine->medicine_name,
                    'old_quantity' => $oldQuantity,
                    'new_quantity' => $medicine->quantity,
                    'reduced_by' => $data['quantity_product']
                ]);
            } else {
                \Log::error('INSUFFICIENT STOCK', [
                    'medicine_name' => $medicine->medicine_name,
                    'required' => $data['quantity_product'],
                    'available' => $medicine->quantity
                ]);
                
                return redirect()->back()->withErrors([
                    'quantity_product' => "Stok tidak mencukupi untuk obat {$medicine->medicine_name}. Stok tersedia: {$medicine->quantity}"
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('ERROR REDUCING STOCK', [
                'error' => $e->getMessage(),
                'selected_medicine_id' => $data['selected_medicine_id']
            ]);
            
            return redirect()->back()->withErrors([
                'quantity_product' => 'Terjadi error saat memproses obat: ' . $e->getMessage()
            ]);
        }
    } else {
        \Log::info('NO MEDICINE STOCK REDUCTION', [
            'quantity_product' => $data['quantity_product'] ?? 'null',
            'selected_medicine_id' => $data['selected_medicine_id'] ?? 'null'
        ]);
    }

    // Membuat data pembayaran setelah stok berhasil dikurangi
    try {
        $payment = Payments::create($data);
        \Log::info('PAYMENT CREATED', ['payment_id' => $payment->id]);
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
