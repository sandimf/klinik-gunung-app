<?php

namespace App\Http\Controllers\Users;

use Inertia\Inertia;
use App\Models\Users\Doctor;
use Illuminate\Http\Request;
use App\Models\Users\Patients;
use App\Http\Controllers\Controller;

class DoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Dashboard/Doctor/Index');
    }

    public function profile()
    {
        return Inertia::render('Profile/Doctor');
    }

    public function appointments()
    {
        return Inertia::render('Dashboard/Doctor/Appointments/Index');
    }

    public function screening()
    {
        $screenings = Patients::with(['answers.question'])
            ->whereHas('answers.question', function ($query) {
                $query->where('requires_doctor', true) // Filter hanya pertanyaan yang tidak membutuhkan dokter
                    ->where(function ($subQuery) {
                        // Cek jika condition_value ada dan jawaban sesuai
                        $subQuery->whereNull('condition_value')
                            ->orWhereHas('answers', function ($subQuery2) {
                                $subQuery2->whereIn('answer_text', function ($query) {
                                    $query->select('condition_value')
                                        ->from('screening_offline_questions')
                                        ->whereNotNull('condition_value');
                                });
                            });
                    });
            })
            ->where('screening_status', 'pending') // Filter hanya screening dengan status pending
            ->get();

        return Inertia::render('Dashboard/Doctor/Screening/Offline/Index', [
            'screenings' => $screenings,
        ]);
    }

    public function show($id)
    {
        $patient = Patients::with(['answers.question'])
            ->findOrFail($id); // Mengambil pasien dan data relasi jawaban dengan pertanyaan

        // Menyiapkan data pertanyaan dan jawaban
        $questionsAndAnswers = $patient->answers->map(function ($answer) {
            return [
                'question' => $answer->question->question_text,
                'answer' => $answer->answer_text,
                'queue' => $answer->queue, // Menambahkan nomor antrian
            ];
        });

        // Mengirim data ke halaman Inertia
        return Inertia::render('Dashboard/Doctor/Screenings/Offline/Index',        [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'queue' => $patient->answers->max('queue'),
        ]);
    }

    public function PatientList()
    {
        // Use paginate() directly on the query builder
        $patients = Patients::paginate(10);

        return Inertia::render('Dashboard/Doctor/Patients/Index', [
            'patients' => $patients,
        ]);
    }
}
