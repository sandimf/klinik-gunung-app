<?php

namespace App\Http\Controllers\Clinic;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Users\PatientsOnline;
use Illuminate\Support\Facades\Auth;
use App\Models\Clinic\PhysicalExaminationOnline;

class PhysicalExaminationOnlineController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Validasi input dari request
        $request->validate([
            'patient_id' => 'required|exists:patients_online,id',
            'blood_pressure' => 'nullable|string',
            'heart_rate' => 'nullable|integer',
            'oxygen_saturation' => 'nullable|integer',
            'respiratory_rate' => 'nullable|integer',
            'body_temperature' => 'nullable|numeric',
            'physical_assessment' => 'required|string',
            'reason' => 'nullable|string',
            'medical_advice' => 'nullable|string',
            'health_status' => 'required|in:healthy,butuh_dokter,butuh_pendamping',
        ]);
        
        // Tentukan ID pemeriksa berdasarkan peran pengguna
        $examinerId = $user->id;
        $paramedisId = null;
        $doctorId = null;
        
        if ($user->role === 'paramedis') {
            $paramedisId = $examinerId;
        } elseif ($user->role === 'doctor') {
            $doctorId = $examinerId;
        }
        
        // Membuat catatan pemeriksaan fisik hanya untuk health check
        if ($request->health_status === 'healthy') {
            // Hanya store pemeriksaan jika status kesehatan adalah 'healthy'
            $examination = PhysicalExaminationOnline::create([
                'patient_id' => $request->patient_id,
                'examiner_id' => $examinerId,
                'examiner_type' => $user->role,
                'paramedis_id' => $paramedisId,
                'doctor_id' => $doctorId,
                'blood_pressure' => $request->blood_pressure,
                'heart_rate' => $request->heart_rate,
                'oxygen_saturation' => $request->oxygen_saturation,
                'respiratory_rate' => $request->respiratory_rate,
                'body_temperature' => $request->body_temperature,
                'physical_assessment' => $request->physical_assessment,
                'reason' => $request->reason,
                'medical_advice' => $request->medical_advice,
                'health_status' => $request->health_status,
            ]);
            
            // Memperbarui status pemeriksaan pasien menjadi 'completed'
            $patient = PatientsOnline::find($request->patient_id);
            $patient->screening_status = 'completed';
            $patient->health_status = $request->health_status;
            $patient->health_check_status = 'completed';
            $patient->save();
            
            // Tidak ada QR code yang perlu di-generate untuk pemeriksaan 'healthy'
        }
    }
}
