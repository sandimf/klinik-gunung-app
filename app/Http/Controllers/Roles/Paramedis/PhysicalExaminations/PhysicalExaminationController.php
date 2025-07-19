<?php

namespace App\Http\Controllers\Roles\Paramedis\PhysicalExaminations;

use App\Events\NewDoctorConsultationEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Paramedis\updatePhysicalAttributesRequest;
use App\Jobs\SendScreeningNotification;
use App\Jobs\SyncPatientsToAirtable;
use App\Models\Clinic\PhysicalExamination;
use App\Models\EMR\MedicalRecord;
use App\Models\Users\Doctor;
use App\Models\Users\Paramedis;
use App\Models\Users\Patients;
use App\Services\Printer\ScreeningPrintService;
use App\Services\QrCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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
        $patient->save();

        // Notifikasi realtime ke dokter jika konsultasi dokter
        if ($request->konsultasi_dokter) {
            // Broadcast event ke dokter
            event(new NewDoctorConsultationEvent($patient));
            // Simpan notifikasi ke tabel notifications untuk dokter
            // Asumsi: ada model Notification dan relasi user dokter
            $doctorUsers = Doctor::all();
            foreach ($doctorUsers as $doctor) {
                \App\Models\Notifications\Notification::create([
                    'user_id' => $doctor->user_id, // Pastikan kolom user_id benar
                    'type' => 'doctor_consultation',
                    'title' => 'Konsultasi Dokter Baru',
                    'message' => 'Ada konsultasi dokter baru untuk pasien '.$patient->name,
                    'data' => [
                        'message' => 'Ada konsultasi dokter baru untuk pasien '.$patient->name,
                        'patient_id' => $patient->id,
                    ],
                    'read_at' => null,
                ]);
            }
        }

        // Dispatch a notification
        // SendScreeningNotification::dispatch($patient);

        SyncPatientsToAirtable::dispatch();

        // Generate QR Code for patient before printing
        try {
            $qrCodeService = new QrCodeService;
            $qrResult = $qrCodeService->generatePatientQrCode($patient);

            if ($qrResult['success']) {
                Log::info('QR Code generated successfully for patient: '.$patient->id, [
                    'qr_path' => $qrResult['qr_code_path'],
                    'unique_link' => $qrResult['unique_link'],
                ]);
            } else {
                Log::warning('QR Code generation failed for patient: '.$patient->id, [
                    'error' => $qrResult['message'],
                ]);
            }
        } catch (\Exception $e) {
            Log::error('QR Code generation exception for patient: '.$patient->id, [
                'error' => $e->getMessage(),
            ]);
        }

        // Print otomatis, kirim $medicalRecord dan paramedis sebagai examiner
        $paramedis = Paramedis::find($request->paramedis_id);
        ScreeningPrintService::printScreening($medicalRecord, $paramedis);

        SendScreeningNotification::dispatch($patient);

        // Kirim notifikasi realtime ke cashier via Go WebSocket server
        $notificationData = [
            'type' => 'physical_exam_done',
            'message' => 'Pasien sudah selesai pemeriksaan fisik',
            'patient_id' => $patient->id,
            'patient_name' => $patient->name,
            'created_at' => now()->toDateTimeString(),
            'notification_type' => 'physical_exam_done',
        ];
        \Illuminate\Support\Facades\Http::withHeaders(['Content-Type' => 'application/json'])
            ->post('http://localhost:8080/notify', $notificationData);

        // Simpan notifikasi ke database untuk semua cashier
        $cashiers = \App\Models\Users\Cashier::all();
        foreach ($cashiers as $cashier) {
            \App\Models\Notifications\Notification::create([
                'user_id' => $cashier->user_id,
                'type' => 'physical_exam_done',
                'title' => 'Pemeriksaan Fisik Selesai',
                'message' => 'Pasien sudah selesai pemeriksaan fisik',
                'data' => [
                    'patient_id' => $patient->id,
                    'patient_name' => $patient->name,
                ],
                'read_at' => null,
            ]);
        }

        return back()->with('success', 'Pemeriksaan Fisik Berhasil Berhasil di Simpan!');
    }

    public function editScreening($id)
    {
        $examination = PhysicalExamination::where('id', $id)->firstOrFail();

        // Format field numerik agar tidak ada trailing .00
        foreach (['tinggi_badan', 'berat_badan'] as $field) {
            if (isset($examination[$field])) {
                $value = $examination[$field];
                // Jika float dan tidak ada desimal, jadikan integer
                if (is_numeric($value)) {
                    $examination[$field] = $value == (int) $value ? (int) $value : $value + 0;
                }
            }
        }

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

    public function updatePhysicalAttributes(updatePhysicalAttributesRequest $request, $id)
    {
        $validated = $request->validated();

        $patient = Patients::findOrFail($id);
        $patient->update($validated);

        return back()->with('success', 'Data fisik pasien berhasil diperbarui.');
    }

    public function selesaiPemeriksaanFisik(Request $request)
    {
        // ... logic pemeriksaan fisik selesai

        // Data notifikasi
        $patient = Patients::find($request->patient_id);
        $data = [
            'type' => 'physical_exam_done',
            'message' => 'Pasien sudah selesai pemeriksaan fisik',
            'patient_id' => $patient->id,
            'patient_name' => $patient->name,
            'created_at' => now()->toDateTimeString(),
            'notification_type' => 'physical_exam_done',
        ];

        // Kirim ke Go WebSocket server
        Http::withHeaders(['Content-Type' => 'application/json'])
            ->post('http://localhost:8080/notify', $data);

        // ... lanjutkan response/logic lain
    }
}
