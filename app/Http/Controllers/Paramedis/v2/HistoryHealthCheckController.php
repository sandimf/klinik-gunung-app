<?php

namespace App\Http\Controllers\Paramedis\v2;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Inertia\Inertia;

class HistoryHealthCheckController extends Controller
{
    public function index()
    {
        $offlineScreenings = Patients::with(['answers.question'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'completed')
            ->get();

        $onlineScreenings = PatientsOnline::with(['answers.question'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'completed')
            ->get();

        $screenings = collect([])->merge($offlineScreenings)->merge($onlineScreenings);

        return Inertia::render('Dashboard/Paramedis/Screenings/History/Index', [
            'screenings' => $screenings->all(),
        ]);
    }

    public function show($uuid)
    {
        $patient = Patients::with([
            'answers.question',
            'physicalExaminations',
        ])
            ->where('uuid', $uuid)
            ->firstOrFail();

        // Menyiapkan data pertanyaan dan jawaban
        $questionsAndAnswers = $patient->answers->map(function ($answer) {
            return [
                'question' => $answer->question->question_text,
                'answer' => $answer->answer_text,
                'id' => $answer->id,
                'queue' => $answer->queue, // Menambahkan nomor antrian
            ];
        });

        // Menyiapkan data pemeriksaan fisik (history)
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
                'created_at' => $exam->created_at->format('Y-m-d H:i:s'),
            ];
        });

        // Mengirim data ke halaman Inertia
        return Inertia::render('Dashboard/Paramedis/Screenings/History/Questioner', [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'queue' => $patient->answers->max('queue'),
            'physicalExaminations' => $physicalExaminations,
        ]);
    }
}
