<?php

namespace App\Http\Controllers\Roles\Doctor\Service;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use Inertia\Inertia;

class ConsultationController extends Controller
{
public function show($uuid)
{
    $patient = Patients::with([
        'physicalExaminations',
        'answers.question',
    ])->where('uuid', $uuid)->firstOrFail();

    // Siapkan data pertanyaan dan jawaban screening
    $questionsAndAnswers = $patient->answers->map(function ($answer) {
        return [
            'question' => $answer->question->question_text ?? '-',
            'answer' => $answer->answer_text ?? '-',
            'id' => $answer->id,
            'queue' => $answer->queue,
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
        // dd($patient->physicalExaminations);
        return Inertia::render('Dashboard/Doctor/Services/Consultation/Details/Index', [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'physicalExaminations' => $physicalExaminations,
        ]);
    }

    public function index()
    {
        $patients = Patients::with([
            'physicalExaminations',
            'answers.question',
        ])
            ->where('konsultasi_dokter', 1)
        // ->where('screening_status', 'completed')
            ->get();

        return Inertia::render('Dashboard/Doctor/Services/Consultation/Index', [
            'patients' => $patients,
        ]);
    }

    public function updatePhysical($id, \Illuminate\Http\Request $request)
    {
        $exam = \App\Models\Clinic\PhysicalExamination::findOrFail($id);
        $exam->update($request->only([
            'blood_pressure',
            'heart_rate',
            'oxygen_saturation',
            'respiratory_rate',
            'body_temperature',
            'physical_assessment',
            'reason',
            'medical_advice',
            'health_status',
        ]));

        // Set konsultasi_dokter_status ke 1 untuk pasien terkait
        \App\Models\Users\Patients::where('id', $exam->patient_id)->update(['konsultasi_dokter_status' => 1]);

        return back()->with('success', 'Pemeriksaan fisik berhasil diupdate.');
    }

    public function updateAnswer($id, \Illuminate\Http\Request $request)
    {
        $answer = \App\Models\Screenings\ScreeningAnswers::findOrFail($id);
        $answer->update([
            'answer_text' => $request->input('answer_text'),
        ]);

        // Set konsultasi_dokter_status ke 1 untuk pasien terkait
        \App\Models\Users\Patients::where('id', $answer->patient_id)->update(['konsultasi_dokter_status' => 1]);

        return back()->with('success', 'Jawaban screening berhasil diupdate.');
    }
}
