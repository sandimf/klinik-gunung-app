<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use App\Models\QrCode;
use App\Models\Users\PatientsOnline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;

class QrcodeController extends Controller
{
    public function show($id)
    {
        // Ambil data QR code berdasarkan ID pasien atau QR code
        $qrCode = QrCode::with('patient')->where('id', $id)->first();

        // Jika QR code tidak ditemukan, beri error 404
        if (! $qrCode) {
            abort(404, 'QR Code not found.');
        }

        // Periksa status scan_status pada tabel PatientsOnline
        $patient = $qrCode->patient;
        if ($patient->scan_status === 'completed') {
            return redirect()->route('screening-online.index')->with('message', 'QR Code has already been scanned.');
        }

        // Kirim data ke frontend menggunakan Inertia jika scan_status belum completed
        return Inertia::render('Dashboard/Patients/Screenings/Online/QrCode/Index', [
            'screening' => $qrCode,
        ]);
    }

    public function decrypt(Request $request)
    {
        $request->validate([
            'encryptedData' => 'required|string',
        ]);

        try {
            // Dekripsi data QR code
            $decryptedData = Crypt::decryptString($request->encryptedData);
            $data = json_decode($decryptedData, true);

            // Ambil ID pasien dari data yang didekripsi
            $patientId = $data['patient_id']; // Sesuaikan dengan struktur data QR code Anda

            // Temukan pasien berdasarkan ID dan perbarui scan_status
            $patient = PatientsOnline::findOrFail($patientId);

            // Periksa apakah scan_status saat ini belum "completed"
            if ($patient->scan_status !== 'completed') {
                $patient->scan_status = 'completed';
                $patient->save();
            }

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mendekripsi QR code.',
            ], 400);
        }
    }
}
