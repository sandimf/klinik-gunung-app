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
    
        // Check if the email already exists
        $existingUser  = User::where('email', $validated['email'])->first();
        if ($existingUser ) {
            return response()->json(['message' => 'Email already in use.'], 409); // Conflict response
        }
    
        // Create a random password
        $password = Str::random(10);
        
        // Create the user
        $user = User::create([
            'email' => $validated['email'],
            'name' => $validated['name'],
            'password' => Hash::make($password),
        ]);
    
        // Send an email to the guest user with the account details
        Mail::to($user->email)->queue(new AccountCreated($user, $password));
        $userId = $user->id;  // Assign the user ID for guest user
    
        // Save patient data to the database with the assigned user_id
        Patients::create([
            'user_id' => $userId,
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
            'screening_status' => "pending",
            'health_status' => "pending",
            'health_check_status' => "pending",
            'payment_status' => "pending",
        ]);
    
        // Save online patient data with the assigned user_id
        PatientsOnline::create([
            'user_id' => $userId,
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
            'screening_status' => "pending",
            'health_status' => "pending",
            'health_check_status' => "pending",
            'payment_status' => "pending",
        ]);
    
        // Save answers within a transaction to ensure atomicity
        DB::transaction(function () use ($request, $userId) {
            // Find or create user and patient (if not logged in, treat as guest)
            $patient = $this->findOrCreateUserAndPatient($request, $userId);
    
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
    
        // Return a success response
        return response()->json(['message' => 'Jawaban dan data pasien disimpan dengan sukses.'], 201);
    }
    
    private function findOrCreateUserAndPatient($request)
    {

        $password = Str::random(10);
        // Check if the user already exists
        $user = User::firstOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                'password' => Hash::make($password), // Create a random password
            ]
        );
    
        // If a new user was created, send an email with their credentials
        if ($user->wasRecentlyCreated) {
            Mail::to($user->email)->queue(new AccountCreated($user, $password));
        }
    
        // Create a new patient
        $patient = Patients::create([
            'user_id' => $user->id,
            'nik' => $request->nik,
            'name' => $request->name,
            'place_of_birth' => $request->place_of_birth,
            'date_of_birth' => $request->date_of_birth,
            'rt_rw' => $request->rt_rw,
            'address' => $request->address,
            'village' => $request->village,
            'district' => $request->district,
            'religion' => $request->religion,
            'marital_status' => $request->marital_status,
            'occupation' => $request->occupation,
            'nationality' => $request->nationality,
            'gender' => $request->gender,
            'email' => $request->email,
            'age' => $request->age,
            'contact' => $request->contact,
            'ktp_images' => $request->ktp_images ?? null, // Jika ada, masukkan gambar KTP
            'screening_status' => 'pending',
            'health_status' => 'pending',
            'health_check_status' => 'pending',
            'payment_status' => 'pending',
        ]);
    
        return $patient;
    }

    public function tes()
    {
        $questions = ScreeningQuestions::all();

        return Inertia::render('Dashboard/Guest/Test', [
            'questions' => $questions,
        ]);
    }
}
