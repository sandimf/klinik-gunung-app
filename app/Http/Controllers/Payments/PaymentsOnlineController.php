<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Jobs\SendQrCodeEmail;
use App\Models\Payments\PaymentOnline;
use App\Models\QrCode as QrCodeModel;
use App\Models\Users\PatientsOnline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PaymentsOnlineController extends Controller
{
    public function create($screeningId)
    {
        // Ambil data screening berdasarkan ID
        $screening = PatientsOnline::findOrFail($screeningId);

        // Periksa jika payment_status adalah 'checking'
        if ($screening->payment_status === 'checking') {
            // Delay 3 detik sebelum redirect
            // Redirect setelah delay
            return redirect()->route('screening-online.index')
                ->with('message', 'Status pembayaran Anda sedang dalam pengecekan. Silakan tunggu konfirmasi.');
        }

        // Jika status tidak 'pending' dan 'checking', lanjutkan untuk render halaman pembayaran
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
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
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
            ->with('message', 'Payment has been successfully recorded.');
    }

    public function confirmPayment($id)
    {
        // Temukan pembayaran berdasarkan ID
        $payment = PaymentOnline::findOrFail($id);

        // Perbarui status pembayaran
        $payment->update([
            'payment_status' => 1,
            'status' => 'completed',
        ]);

        // Perbarui data pasien jika ada
        $patient = PatientsOnline::find($payment->patient_id);
        if ($patient) {
            $patient->update([
                'payment_status' => 'completed',
            ]);
        }

        // Generate QR code data with payment_status, patient_id, and name
        $qrData = [
            'payment_status' => $payment->payment_status,
            'patient_id' => $patient->id,
            'name' => $patient->name,
            'date' => now()->toDateTimeString(),
        ];

        // Mengenkripsi data QR code agar tidak bisa dibaca langsung
        $encryptedData = Crypt::encryptString(json_encode($qrData));

        // Membuat QR code dengan data terenkripsi
        $qrCodePath = 'qrcodes/'.uniqid().'.png';
        $qrCodeContent = QrCode::format('png')
            ->size(300)
            ->generate($encryptedData);

        // Menyimpan QR code ke dalam folder public
        Storage::disk('public')->put($qrCodePath, $qrCodeContent);

        // Simpan QR code ke dalam tabel qr_codes dengan relasi ke pasien
        $qrCode = new QrCodeModel;
        $qrCode->patient_id = $patient->id; // Link to the patient
        $qrCode->qrcode = Storage::url($qrCodePath); // Store the QR code URL
        $qrCode->save();

        // Kirim email dengan QR code
        SendQrCodeEmail::dispatch($patient, Storage::url($qrCodePath));

        // Redirect dengan pesan sukses
        return redirect()->route('cashier.screening-online')
            ->with('message', 'Payment has been successfully confirmed and QR code has been sent.');
    }
}
