<?php

namespace App\Http\Controllers\Roles\Doctor\Managements;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientsListController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $query = DB::table('patients')
            ->select('id', 'uuid', 'name', 'date_of_birth', 'age', 'contact', 'health_status');
        if ($search) {
            $query->where('name', 'like', '%'.$search.'%');
        }
        $patients = $query->orderBy('name')->paginate(10);
        return Inertia::render('Dashboard/Doctor/Patients/Index', [
            'patients' => $patients,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

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
        return Inertia::render('Dashboard/Doctor/Patients/_components/detail', [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'physicalExaminations' => $physicalExaminations,
        ]);
    }
}
