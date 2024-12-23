<?php

namespace App\Http\Controllers\Screenings;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Users\Patients;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\Screenings\ScreeningQuestions;
use App\Http\Requests\Screenings\ScreeningOfflineRequest;

class ScreeningOfflineController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $user = Auth::user();

        $patient = Patients::where('user_id', $user->id)->first();

        if (!$patient) {
            return redirect()->route('information.index')
                ->with('message', 'Masukan data diri kamu terlebih dahulu sebelum melakukan screening.');
        }

        // Fetch the patient and their related questionnaire answers
        $screening = Patients::with('answers') // Eager load answers
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        return Inertia::render('Dashboard/Patients/Screenings/Offline/Index', [
            'screening' => $screening,
            // Kirim data pasien jika ada
        ]);
    }

    public function create()
    {
        $questions = ScreeningQuestions::all();

        $user = Auth::user();

        $patient = $user->patient;

        return Inertia::render('Dashboard/Patients/Screenings/Offline/ScreeningOffline', [
            'questions' => $questions,
            'patient' => $patient,
        ]);
    }

    public function store(ScreeningOfflineRequest $request)
    {
        DB::transaction(function () use ($request) {
            // Cari data pasien berdasarkan NIK
            $patient = Patients::firstOrNew(['nik' => $request->nik]);

            // Perbarui data pasien
            $patient->fill([
                'user_id' => Auth::id(),
                'name' => $request->name,
                'age' => $request->age,
                'gender' => $request->gender,
                'contact' => $request->contact,
                'email' => $request->email,
                'screening_status' => 'pending',
                'health_status' => 'pending',
                'health_check_status' => 'pending',
                'payment_status' => 'pending',
            ]);
            $patient->save();

            // Dapatkan posisi antrian terakhir
            $lastQueuePosition = ScreeningAnswers::max('queue') ?? 0;

            foreach ($request->answers as $index => $answer) {
                $answer_text = $answer['answer'];

                // Gabungkan jawaban jika array
                if (is_array($answer_text)) {
                    $answer_text = implode(', ', $answer_text);
                }

                // Simpan jawaban
                ScreeningAnswers::create([
                    'question_id' => $answer['questioner_id'],
                    'patient_id' => $patient->id,
                    'answer_text' => $answer_text,
                    'queue' => $lastQueuePosition + $index + 1,
                ]);
            }
        });

        return;
    }

    public function show($id)
    {
        $userId = Auth::id();
        // Mengambil data pasien dan jawaban screening terkait pengguna yang sedang login
        $screening = Patients::with('answers.question') // Eager load answers dan pertanyaan yang terkait
            ->where('user_id', $userId) // Filter hanya pasien milik pengguna yang sedang login
            ->findOrFail($id);

        // Kirim data pasien beserta jawaban screening ke tampilan Inertia
        return Inertia::render('Dashboard/Patients/Screenings/Details/ScreeningOfflineDetail', [
            'screening' => $screening,
        ]);
    }
}
