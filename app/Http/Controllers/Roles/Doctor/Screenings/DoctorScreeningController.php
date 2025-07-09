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
            return [
                'question' => $answer->question->question_text,
                'answer' => $answer->answer_text,
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
