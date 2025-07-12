<?php

namespace App\Http\Controllers\Roles\Paramedis\MedicalRecord;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Users\Patients;
use App\Models\EMR\MedicalRecord;
use App\Http\Controllers\Controller;

class ParamedisMedicalRecordController extends Controller
{

    // public function show($uuid)
    // {
    //     $patient = Patients::with([
    //         'physicalExaminations',
    //         'answers.question',
    //     ])->where('uuid', $uuid)->firstOrFail();

    //     // Siapkan data pertanyaan dan jawaban screening
    //     $questionsAndAnswers = $patient->answers->map(function ($answer) {
    //         $answerText = $answer->answer_text;

    //         // Parse JSON jika jawaban adalah JSON string (untuk checkbox_textarea)
    //         if (is_string($answerText) && (str_starts_with($answerText, '{') || str_starts_with($answerText, '['))) {
    //             try {
    //                 $parsed = json_decode($answerText, true);
    //                 if (json_last_error() === JSON_ERROR_NONE) {
    //                     // Jika berhasil parse JSON, format sesuai struktur
    //                     if (isset($parsed['options']) && isset($parsed['textarea'])) {
    //                         $options = $parsed['options'];
    //                         $textarea = $parsed['textarea'];

    //                         if ($options === 'N/A' && empty($textarea)) {
    //                             $answerText = 'Tidak';
    //                         } else if ($options === 'N/A') {
    //                             $answerText = $textarea;
    //                         } else if (empty($textarea)) {
    //                             $answerText = $options;
    //                         } else {
    //                             $answerText = $options . ' - ' . $textarea;
    //                         }
    //                     } else {
    //                         $answerText = is_array($parsed) ? implode(', ', $parsed) : $parsed;
    //                     }
    //                 }
    //             } catch (\Exception $e) {
    //                 // Jika gagal parse, gunakan string asli
    //             }
    //         }

    //         return [
    //             'question' => $answer->question->question_text ?? '-',
    //             'answer' => $answerText ?? '-',
    //             'id' => $answer->id,
    //             'queue' => $answer->queue,
    //         ];
    //     });

    //     $physicalExaminations = $patient->physicalExaminations->map(function ($exam) {
    //         return [
    //             'id' => $exam->id,
    //             'blood_pressure' => $exam->blood_pressure,
    //             'heart_rate' => $exam->heart_rate,
    //             'oxygen_saturation' => $exam->oxygen_saturation,
    //             'respiratory_rate' => $exam->respiratory_rate,
    //             'body_temperature' => $exam->body_temperature,
    //             'physical_assessment' => $exam->physical_assessment,
    //             'reason' => $exam->reason,
    //             'medical_advice' => $exam->medical_advice,
    //             'health_status' => $exam->health_status,
    //             'created_at' => $exam->created_at->format('Y-m-d'),
    //         ];
    //     });
    //     // dd($patient->physicalExaminations);
    //     return Inertia::render('Dashboard/Paramedis/MedicalRecord/Detail', [
    //         'patient' => $patient,
    //         'questionsAndAnswers' => $questionsAndAnswers,
    //         'physicalExaminations' => $physicalExaminations,
    //     ]);
    // }


    public function index()
    {
        // Ambil semua medical record beserta relasi pasien dan pemeriksaan fisik
        $medicalRecords = MedicalRecord::with([
            'patient.user:id,name,avatar',
            'physicalExamination',
        ])->get();

        // Kirimkan data ke halaman Inertia
        return Inertia::render('Dashboard/Paramedis/MedicalRecord/Index', [
            'medicalRecords' => $medicalRecords,
        ]);
    }

    public function show($uuid)
    {
        $medicalRecord = MedicalRecord::with(['patient', 'physicalExamination'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia::render('Dashboard/Paramedis/MedicalRecord/Detail', [
            'medicalRecord' => $medicalRecord,
        ]);
    }
}
