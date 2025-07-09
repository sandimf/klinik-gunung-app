<?php

namespace App\Http\Controllers\Roles\Paramedis\PhysicalExaminations;

use App\Http\Controllers\Controller;
use App\Jobs\SendScreeningNotification;
use App\Jobs\SyncPatientsToAirtable;
use App\Models\Clinic\PhysicalExamination;
use App\Models\EMR\MedicalRecord;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PhysicalExaminationController extends Controller
{
        protected function generateMedicalRecordNumber()
    {
        $lastRecord = MedicalRecord::latest()->first(); // Ambil rekam medis terakhir
        $lastNumber = $lastRecord ? intval(substr($lastRecord->medical_record_number, 2)) : 0; // Ambil angka terakhir
        $newNumber = $lastNumber + 1; // Tambah 1 untuk nomor baru

        return 'MR'.str_pad($newNumber, 4, '0', STR_PAD_LEFT); // Format nomor: MR0001, MR0002, dst.
    }

    public function store(Request $request)
    {
        // dd($request->all());
        \Log::info('Request data:', $request->all());
        $user = Auth::user(); // Get the authenticated user

        // Validate the request data
        $request->validate([
            'paramedis_id' => 'required|exists:paramedis,id',
            'patient_id' => 'required|exists:patients,id',
            'blood_pressure' => 'nullable|string',
            'heart_rate' => 'nullable|integer',
            'oxygen_saturation' => 'nullable|integer',
            'respiratory_rate' => 'nullable|integer',
            'body_temperature' => 'nullable|numeric',
            'physical_assessment' => 'required|string',
            'reason' => 'nullable|string',
            'medical_advice' => 'nullable|string',
            'health_status' => 'required|in:sehat,tidak_sehat_dengan_pendamping,tidak_sehat',
            'consultation' => 'nullable|integer',
            'medical_accompaniment' => 'nullable|in:pendampingan_perawat,pendampingan_paramedis,pendampingan_dokter',
        ]);

        // Create the physical examination record
        $examination = PhysicalExamination::create([
            'patient_id' => $request->patient_id,
            'paramedis_id' => $request->paramedis_id,
            'blood_pressure' => $request->blood_pressure,
            'heart_rate' => $request->heart_rate,
            'oxygen_saturation' => $request->oxygen_saturation,
            'respiratory_rate' => $request->respiratory_rate,
            'body_temperature' => $request->body_temperature,
            'physical_assessment' => $request->physical_assessment,
            'reason' => $request->reason,
            'medical_advice' => $request->medical_advice,
            'health_status' => $request->health_status,
            'doctor_advice' => $request->doctor_advice,
        ]);

        // Generate the medical record number
        $medicalRecordNumber = $this->generateMedicalRecordNumber();

        // Create a new medical record
        $medicalRecord = MedicalRecord::create([
            'patient_id' => $request->patient_id,
            'physical_examination_id' => $examination->id,
            'medical_record_number' => $medicalRecordNumber,
        ]);

        // Update patient's screening status to 'completed'
        $patient = Patients::find($request->patient_id);
        $patient->screening_status = 'completed';
        $patient->health_status = $request->health_status;
        $patient->health_check_status = 'completed';
        $patient->konsultasi_dokter = $request->konsultasi_dokter;
        $patient->pendampingan = $request->pendampingan;
        \Log::info('Patient after assignment:', $patient->toArray());
        $patient->save();
        \Log::info('Patient after save:', $patient->fresh()->toArray());

        // Dispatch a notification
        // SendScreeningNotification::dispatch($patient);

        SyncPatientsToAirtable::dispatch();

        return back()->with('success', 'Pemeriksaan Fisik Berhasil Berhasil di Simpan!');
    }

    public function editScreening($id)
    {
        $examination = PhysicalExamination::where('id', $id)->firstOrFail(); // Fetch the record by UUID

        return Inertia::render('Dashboard/Paramedis/Screenings/Edit/Index', [
            'examination' => $examination,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user(); // Get the authenticated user

        // Validate the request data
        $request->validate([
            'blood_pressure' => 'nullable|string',
            'heart_rate' => 'nullable|integer',
            'oxygen_saturation' => 'nullable|integer',
            'respiratory_rate' => 'nullable|integer',
            'body_temperature' => 'nullable|numeric',
            'physical_assessment' => 'nullable|string',
            'reason' => 'nullable|string',
            'medical_advice' => 'nullable|string',
            'health_status' => 'nullable|in:sehat,tidak_sehat',
            'doctor_advice' => 'nullable|string',
        ]);

        $examination = PhysicalExamination::findOrFail($id); // Find the record by ID

        // Update the physical examination record
        $examination->update([
            'blood_pressure' => $request->blood_pressure,
            'heart_rate' => $request->heart_rate,
            'oxygen_saturation' => $request->oxygen_saturation,
            'respiratory_rate' => $request->respiratory_rate,
            'body_temperature' => $request->body_temperature,
            'physical_assessment' => $request->physical_assessment,
            'reason' => $request->reason,
            'medical_advice' => $request->medical_advice,
            'health_status' => $request->health_status,
            'doctor_advice' => $request->doctor_advice,
        ]);

        // Update the related patient's health status
        $patient = Patients::find($examination->patient_id);
        $patient->health_status = $request->health_status;
        $patient->save();

        return back()->with('message', 'Pemeriksaan Fisik berhasil diperbarui.');
    }
}
