<?php

namespace App\Http\Controllers\Screenings;

use App\Http\Controllers\Controller;
use App\Mail\AccountCreated;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\Screenings\ScreeningQuestions;
use App\Models\User;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GuestController extends Controller
{
    public function index()
    {
        $questions = ScreeningQuestions::all();

        return Inertia::render('Dashboard/Guest/ScreeningOffline', [
            'questions' => $questions,
        ]);
    }

    public function store(Request $request)
    {
        // Validasi input dari request
        $request->validate([
            'nik' => 'required|string|max:20|unique:patients,nik',
            'name' => 'required|string|max:255',
            'age' => 'required|integer',
            'contact' => 'required|string|numeric',
            'gender' => 'required|string|in:male,female,other',
            'email' => 'nullable|email|max:255|unique:patients,email',
            'answers' => 'required|array',
            'answers.*.questioner_id' => 'required|exists:screening_offline_questions,id',
            'answers.*.answer' => 'required',
        ]);

        // Menyimpan data dalam transaksi untuk memastikan atomik
        DB::transaction(function () use ($request) {
            // Mencari atau membuat pasien dan pengguna
            $patient = $this->findOrCreateUserAndPatient($request);

            foreach ($request->answers as $answer) {
                $answer_text = $answer['answer'];

                // Jika jawaban memiliki 'options' dan 'textarea', gabungkan sebagai satu string
                if (is_array($answer_text) && isset($answer_text['options'], $answer_text['textarea'])) {
                    $options = implode(', ', $answer_text['options']);
                    $textarea = $answer_text['textarea'];
                    $answer_text = trim("$options $textarea");
                }
                // Jika jawaban berupa array (untuk checkbox biasa), gabungkan opsi dengan koma
                elseif (is_array($answer_text)) {
                    $answer_text = implode(', ', $answer_text);
                }
                ScreeningAnswers::create([
                    'question_id' => $answer['questioner_id'],
                    'patient_id' => $patient->id,
                    'answer_text' => $answer_text,
                ]);
            }
        });

        // Mengembalikan response sukses
        return response()->json(['message' => 'Jawaban dan data pasien disimpan dengan sukses.'], 201);
    }

    private function findOrCreateUserAndPatient($request)
    {
        // Membuat password acak untuk user
        $password = Str::random(10);

        // Mencari atau membuat pengguna berdasarkan email
        $user = User::firstOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                'password' => Hash::make($password),
            ]
        );

        // Jika pengguna baru dibuat, kirim email dengan kredensial mereka
        if ($user->wasRecentlyCreated) {
            Mail::to($user->email)->queue(new AccountCreated($user, $password));
        }

        // Membuat pasien baru
        $patient = Patients::create([
            'nik' => $request->nik,
            'name' => $request->name,
            'age' => $request->age,
            'gender' => $request->gender,
            'contact' => $request->contact,
            'email' => $request->email,
            'user_id' => $user->id,
            'screening_status' => 'pending',
            'health_status' => 'pending',
            'health_check_status' => 'pending',
            'payment_status' => 'pending',
        ]);

        return $patient;
    }
}
