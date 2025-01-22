<?php

namespace App\Http\Controllers\Screenings;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuestScreeningRequest;
use App\Mail\AccountCreated;
use App\Models\Ai\Apikey;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\Screenings\ScreeningQuestions;
use App\Models\User;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
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

        $apiKey = Apikey::first()?->api_key;


        return Inertia::render('Dashboard/Guest/ScreeningOffline', [
            'questions' => $questions,
            'apiKey' => $apiKey,
        ]);
    }

    public function store(GuestScreeningRequest $request)
    {
        // Validasi data dari request
        $validated = $request->validated();

        // Daftar field yang perlu diformat
        $fieldsToFormat = [
            'name',
            'place_of_birth',
            'district',
            'village',
            'address',
            'occupation',
            'religion',
            'nationality',
            'gender',
            'marital_status',
        ];

        // Format setiap field yang ditentukan
        foreach ($fieldsToFormat as $field) {
            if (isset($validated[$field]) && is_string($validated[$field])) {
                $validated[$field] = ucwords(strtolower($validated[$field]));
            }
        }

        // Proses upload gambar KTP
        if ($request->hasFile('ktp_images')) {
            $image = $request->file('ktp_images');
            // Menyimpan gambar ke direktori public (storage/app/public/ktp_images)
            $imagePath = $image->store('ktp_images', 'public');
            $validated['ktp_images'] = $imagePath; // Simpan path relatif dalam database
        }

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
                    'blood_type' => $validated['blood_type'],
                    'ktp_images' => $validated['ktp_images'] ?? null,
                    'screening_status' => 'pending',
                    'health_status' => 'pending',
                    'health_check_status' => 'pending',
                    'payment_status' => 'pending',
                ]
            );

            if (PatientsOnline::where('nik', $validated['nik'])->exists()) {
                return back()->withErrors([
                    'nik' => 'NIK sudah terdaftar.',
                ])->withInput();
            }

            // Jika NIK belum ada, lanjutkan untuk membuat entri baru
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
                'blood_type' => $validated['blood_type'],
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
}
