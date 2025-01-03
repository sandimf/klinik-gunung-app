<?php

namespace App\Http\Controllers\Screenings;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Mail\AccountCreated;
use App\Models\Users\Patients;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Users\PatientsOnline;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\Screenings\ScreeningAnswers;
use App\Http\Requests\GuestScreeningRequest;
use App\Models\Screenings\ScreeningQuestions;

class GuestController extends Controller
{
    public function index()
    {
        $questions = ScreeningQuestions::all();

        return Inertia::render('Dashboard/Guest/ScreeningOffline', [
            'questions' => $questions,
        ]);
    }

    public function store(GuestScreeningRequest $request)
    {
        $validated = $request->validated();
    
        DB::transaction(function () use ($validated, $request) {
            // Buat user baru atau ambil yang sudah ada
            $user = User::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'name' => $validated['name'],
                    'password' => Hash::make(Str::random(10)),
                ]
            );
    
            // Jika user baru dibuat, kirimkan email dengan detail login
            if ($user->wasRecentlyCreated) {
                $password = Str::random(10);
                $user->update(['password' => Hash::make($password)]);
                Mail::to($user->email)->queue(new AccountCreated($user, $password));
            }
    
            // Simpan data pasien di tabel `patients`
            $patient = Patients::firstOrCreate(
                ['nik' => $validated['nik']],
                [
                    'user_id' => $user->id,
                    'name' => $validated['name'],
                    'place_of_birth' => $validated['place_of_birth'],
                    'date_of_birth' => $validated['date_of_birth'],
                    'rt_rw' => $validated['rt_rw'],
                    'address' => $validated['address'],
                    'village' => $validated['village'],
                    'district' => $validated['district'],
                    'religion' => $validated['religion'],
                    'marital_status' => $validated['marital_status'],
                    'occupation' => $validated['occupation'],
                    'nationality' => $validated['nationality'],
                    'gender' => $validated['gender'],
                    'email' => $validated['email'],
                    'age' => $validated['age'],
                    'contact' => $validated['contact'],
                    'ktp_images' => $validated['ktp_images'] ?? null,
                    'screening_status' => 'pending',
                    'health_status' => 'pending',
                    'health_check_status' => 'pending',
                    'payment_status' => 'pending',
                ]
            );
    
            // Simpan data pasien online di tabel `patients_online`
            PatientsOnline::create([
                'user_id' => $user->id,
                'nik' => $validated['nik'],
                'name' => $validated['name'],
                'place_of_birth' => $validated['place_of_birth'],
                'date_of_birth' => $validated['date_of_birth'],
                'rt_rw' => $validated['rt_rw'],
                'address' => $validated['address'],
                'village' => $validated['village'],
                'district' => $validated['district'],
                'religion' => $validated['religion'],
                'marital_status' => $validated['marital_status'],
                'occupation' => $validated['occupation'],
                'nationality' => $validated['nationality'],
                'gender' => $validated['gender'],
                'email' => $validated['email'],
                'age' => $validated['age'],
                'contact' => $validated['contact'],
                'ktp_images' => $validated['ktp_images'] ?? null,
            ]);
    
            // Simpan jawaban screening ke tabel `screening_answers`
            $lastQueuePosition = ScreeningAnswers::max('queue') ?? 0;
            foreach ($request->answers as $index => $answer) {
                $answerText = is_array($answer['answer']) ? implode(', ', $answer['answer']) : $answer['answer'];
    
                ScreeningAnswers::create([
                    'question_id' => $answer['questioner_id'],
                    'patient_id' => $patient->id,
                    'answer_text' => $answerText,
                    'queue' => $lastQueuePosition + $index + 1,
                ]);
            }
        });
    
        // Kembalikan respons sukses
        return back()->with('success', 'Data pasien dan screening berhasil disimpan.');
    }
    
    public function tes()
    {
        $questions = ScreeningQuestions::all();

        return Inertia::render('Dashboard/Guest/Test', [
            'questions' => $questions,
        ]);
    }
}
