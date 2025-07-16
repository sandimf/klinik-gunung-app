<?php

namespace App\Http\Controllers\Roles\Doctor\Screenings;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use Inertia\Inertia;

class DoctorScreeningController extends Controller
{
    public function index()
    {

        $screenings = Patients::with(['answers.question'])
            ->get();

        return Inertia::render('Dashboard/Doctor/Screening/Index', [
            'screenings' => $screenings,
        ]);
    }

    public function show($uuid)
    {

        $patient = Patients::with(['physicalExaminations', 'answers.question'])
            ->where('uuid', $uuid)
            ->firstOrFail(); // Mengambil pasien berdasarkan uuid dan data relasi jawaban dengan pertanyaan

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
                            } elseif ($options === 'N/A') {
                                $answerText = $textarea;
                            } elseif (empty($textarea)) {
                                $answerText = $options;
                            } else {
                                $answerText = $options.' - '.$textarea;
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
                'queue' => $answer->queue, // Menambahkan nomor antrian
            ];
        });

        $physicalExaminations = $patient->physicalExaminations->map(function ($exam) {
            return [
                'id' => $exam->id,
                'blood_pressure' => $exam->blood_pressure,
                'heart_rate' => $exam->heart_rate,
                'oxygen_saturation' => $exam->oxygen_saturation,
                'respiratory_rate' => $exam->respiratory_rate,
                'body_temperature' => $exam->body_temperature,
                'physical_assessment' => $exam->physical_assessment,
                'reason' => $exam->reason,
                'medical_advice' => $exam->medical_advice,
                'health_status' => $exam->health_status,
                'created_at' => $exam->created_at->format('Y-m-d'),
            ];
        });

        // Mengirim data ke halaman Inertia
        return Inertia::render('Dashboard/Doctor/Screening/_components/detail', [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'queue' => $patient->answers->max('queue'),
            'physicalExaminations' => $physicalExaminations,
        ]);
    }
}
