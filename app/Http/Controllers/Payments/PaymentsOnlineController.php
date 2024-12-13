<?php

namespace App\Http\Controllers\Payments;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Users\PatientsOnline;
use App\Models\Payments\PaymentOnline;

class PaymentsOnlineController extends Controller
{
    public function create($screeningId)
    {
        // Ambil data screening berdasarkan ID
        $screening = PatientsOnline::findOrFail($screeningId);

        return Inertia::render('Dashboard/Patients/Screenings/Online/Payments/Index', [
            'screening' => $screening,
        ]);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string',
        'patient_id' => 'required|exists:patients_online,id',
        'screening_online_answer_id' => 'nullable|exists:screening_online_answers,id',
        'amount_paid' => 'required|numeric|min:0',
        'payment_method' => 'required|string',
        'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048'
    ]);

    // Upload bukti pembayaran jika ada
    if ($request->hasFile('payment_proof')) {
        $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'public');
        $validated['payment_proof'] = $paymentProofPath;
    }

    // Simpan data pembayaran
    $payment = PaymentOnline::create([
        'name' => $validated['name'],
        'patient_id' => $validated['patient_id'],
        'screening_online_answer_id' => $validated['screening_online_answer_id'],
        'payment_status' => false, // Awalnya belum lunas
        'status' => 'checking',
        'amount_paid' => $validated['amount_paid'],
        'payment_method' => $validated['payment_method'],
        'payment_proof' => $validated['payment_proof'] ?? null,
    ]);

    // Update `payment_status` di tabel `patients_online`
    $patient = PatientsOnline::find($validated['patient_id']);
    if ($patient) {
        $patient->update(['payment_status' => 'checking']); // Contoh update kolom `payment_status`
    }

    return redirect()->route('screening-online.index', $payment->id)
        ->with('success', 'Payment has been successfully recorded.');
}


    public function confirmPayment($id)
    {
        // Find the payment by ID
        $payment = PaymentOnline::findOrFail($id);

        // Update the payment status
        $payment->update([
            'payment_status' => 1, // Mark as completed
            'status' => 'completed',
        ]);

        // Optionally, update the patient record if needed
        $patient = PatientsOnline::find($payment->patient_id);
        if ($patient) {
            $patient->update([
                'payment_status' => 'completed',
            ]);
        }

        // Redirect or return a view with success message
        return Inertia::render('PaymentConfirmation', [
            'message' => 'Payment has been successfully confirmed.',
            'payment' => $payment,
        ]);
    }


}
