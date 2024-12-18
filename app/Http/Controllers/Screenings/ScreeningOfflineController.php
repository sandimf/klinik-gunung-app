<?php

namespace App\Http\Controllers\Screenings;

use App\Http\Controllers\Controller;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\Screenings\ScreeningQuestions;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ScreeningOfflineController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $user = Auth::user();
        $patient = Patients::where('user_id', $user->id)->first();

        if (!$patient) {
            // Redirect ke halaman untuk melengkapi data pasien
            return redirect()->route('information.index')
                ->with('warning', 'Please complete your patient profile before accessing appointments.');
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

    public function store(Request $request)
    {
        // Validasi data masukan dari request
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

        // Jalankan proses simpan dalam transaksi untuk memastikan data tersimpan secara atomik
        DB::transaction(function () use ($request) {
            $patient = Patients::create([
                'user_id' => Auth::id(),
                'nik' => $request->nik,
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

            // Dapatkan posisi antrian terakhir untuk menghindari duplikasi posisi antrian
            $lastQueuePosition = ScreeningAnswers::max('queue') ?? 0;

            foreach ($request->answers as $index => $answer) {
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

                // Simpan jawaban dengan posisi antrian yang diurutkan secara otomatis
                ScreeningAnswers::create([
                    'question_id' => $answer['questioner_id'],
                    'patient_id' => $patient->id,
                    'answer_text' => $answer_text,
                    'queue' => $lastQueuePosition + $index + 1, // Posisi antrian otomatis bertambah
                ]);
            }
        });

        return response()->json(['message' => 'Jawaban dan data pasien disimpan dengan sukses.'], 201);
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
