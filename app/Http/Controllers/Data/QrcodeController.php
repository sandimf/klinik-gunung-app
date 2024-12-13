<?php

namespace App\Http\Controllers\Data;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Crypt;
use App\Models\Clinic\PhysicalExaminationOnline;

class QrcodeController extends Controller
{

    public function show($id)
    {
        // Ambil data pemeriksaan fisik berdasarkan ID
        $screening = PhysicalExaminationOnline::findOrFail($id);
    
        // Mengirim data ke frontend menggunakan Inertia
        return Inertia::render('Dashboard/Patients/Screenings/Online/QrCode/Index', [
            'screening' => $screening,
        ]);
    }



    public function decrypt(Request $request)
    {
        $request->validate([
            'encryptedData' => 'required|string',
        ]);
    
        try {
            $decryptedData = Crypt::decryptString($request->encryptedData);
            $data = json_decode($decryptedData, true);
    
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
