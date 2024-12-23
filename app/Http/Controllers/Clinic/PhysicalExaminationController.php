<?php

namespace App\Http\Controllers\Clinic;

use Illuminate\Http\Request;
use App\Models\Users\Patients;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SendScreeningNotification;
use App\Models\Clinic\PhysicalExamination;

class PhysicalExaminationController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user(); // Get the authenticated user

        // Validate the request data
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
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

        $examinerId = $user->id;
        $paramedisId = null;
        $doctorId = null;

     
        if ($user->role === 'paramedis') {
            $paramedisId = $examinerId;  // Set paramedis_id for 'paramedis' role
        } elseif ($user->role === 'doctor') {
            $doctorId = $examinerId;      // Set doctor_id for 'doctor' role
        }

        // Create the physical examination record
        $examination = PhysicalExamination::create([
            'patient_id' => $request->patient_id,
            'examiner_id' => $examinerId,  // Store the examiner's ID
            'examiner_type' => $user->role, // Store the examiner's role
            'paramedis_id' => $paramedisId, // Only set if the user is a paramedis
            'doctor_id' => $doctorId,      // Only set if the user is a doctor
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

        // Update patient's screening status to 'completed'
        $patient = Patients::find($request->patient_id);
        $patient->screening_status = 'completed';
        $patient->health_status = $request->health_status;
        $patient->health_check_status = 'completed';
        $patient->save();

        SendScreeningNotification::dispatch($patient);
        
        // Return a successful response with the examination details
        return response()->json([
            'message' => 'Examination saved successfully!',
            'examination' => $examination,
        ]);
    }



}
