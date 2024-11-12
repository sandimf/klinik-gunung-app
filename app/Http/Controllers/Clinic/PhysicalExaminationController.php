<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Clinic\PhysicalExamination;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PhysicalExaminationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */

    /**
     * Store a newly created resource in storage.
     */
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

        // Initialize examiner id and role-related variables
        $examinerId = $user->id;
        $paramedisId = null;
        $doctorId = null;

        // Check the user role and set the appropriate examiner details
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
        $patient->save();

        // Return a successful response with the examination details
        return response()->json([
            'message' => 'Examination saved successfully!',
            'examination' => $examination,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PhysicalExamination $phhysicalExamination)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PhysicalExamination $physicalExamination)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PhysicalExamination $physicalExamination)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PhysicalExamination $physicalExamination)
    {
        //
    }
}
