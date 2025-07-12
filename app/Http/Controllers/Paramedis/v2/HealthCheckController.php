<?php

namespace App\Http\Controllers\Paramedis\v2;

use App\Http\Controllers\Controller;
use App\Jobs\SendScreeningNotification;
use App\Jobs\SyncPatientsToAirtable;
use App\Models\Clinic\PhysicalExamination;
use App\Models\EMR\MedicalRecord;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HealthCheckController extends Controller
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
        SendScreeningNotification::dispatch($patient);

        SyncPatientsToAirtable::dispatch();

        return back()->with('success', 'Pemeriksaan Fisik Berhasil Berhasil di Simpan!');
    }

    public function show($uuid)
    {
        $patient = Patients::with(['answers.question'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        // Menyiapkan data pertanyaan dan jawaban
        $questionsAndAnswers = $patient->answers->map(function ($answer) {
            $answerText = $answer->answer_text;
            
            // Parse JSON jika jawaban adalah JSON string (untuk checkbox_textarea)
            if (is_string($answerText) && (str_starts_with($answerText, '{') || str_starts_with($answerText, '['))) {
                try {
                    $parsed = json_decode($answerText, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        // Jika berhasil parse JSON, format sesuai struktur
                        if (isset($parsed['options']) && isset($parsed['textarea'])) {
                            $options = $parsed['options'];
                            $textarea = $parsed['textarea'];
                            
                            if ($options === 'N/A' && empty($textarea)) {
                                $answerText = 'Tidak';
                            } else if ($options === 'N/A') {
                                $answerText = $textarea;
                            } else if (empty($textarea)) {
                                $answerText = $options;
                            } else {
                                $answerText = $options . ' - ' . $textarea;
                            }
                        } else {
                            $answerText = is_array($parsed) ? implode(', ', $parsed) : $parsed;
                        }
                    }
                } catch (\Exception $e) {
                    // Jika gagal parse, gunakan string asli
                }
            }
            
            return [
                'question' => $answer->question->question_text,
                'answer' => $answerText,
                'id' => $answer->id,
                'queue' => $answer->queue,
            ];
        });

        // Mengirim data ke halaman Inertia
        return Inertia::render('Dashboard/Paramedis/Screenings/Details/Index', [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'queue' => $patient->answers->max('queue'),
            'ai_saran' => session('ai_saran'), // tambahkan ini
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
            'physical_assessment' => 'required|string',
            'reason' => 'nullable|string',
            'medical_advice' => 'nullable|string',
            'health_status' => 'required|in:healthy,butuh_dokter,butuh_pendamping',
            'tinggi_badan' => 'nullable|numeric|min:1',
            'berat_badan' => 'nullable|numeric|min:1',
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
        ]);

        // Update tinggi/berat badan pasien jika ada
        if ($request->filled('tinggi_badan') || $request->filled('berat_badan')) {
            $patient = Patients::find($examination->patient_id);
            if ($request->filled('tinggi_badan')) {
                $patient->tinggi_badan = $request->tinggi_badan;
            }
            if ($request->filled('berat_badan')) {
                $patient->berat_badan = $request->berat_badan;
            }
            $patient->save();
        }

        // Update the related patient's health status
        $patient = Patients::find($examination->patient_id);
        $patient->health_status = $request->health_status;
        $patient->save();

        return back()->with('success', 'Pemeriksaan Fisik berhasil diperbarui.');
    }
}
