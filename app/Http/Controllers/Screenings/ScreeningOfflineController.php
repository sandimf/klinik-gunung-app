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
use Barryvdh\DomPDF\Facade\Pdf;

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

    public function show($uuid)
    {
        $userId = Auth::id();
        
        // Mencari pasien berdasarkan uuid dan user_id
        $screening = Patients::with(['answers.question', 'physicalExaminations'])
            ->where('user_id', $userId)
            ->where('uuid', $uuid) // Menggunakan UUID di query
            ->firstOrFail(); // Gunakan firstOrFail agar jika UUID tidak ditemukan, otomatis memunculkan error
    
        // Kirim data pasien beserta jawaban screening dan pemeriksaan fisik ke tampilan Inertia
        return Inertia::render('Dashboard/Patients/Screenings/Details/ScreeningOfflineDetail', [
            'screening' => $screening,
        ]);
    }
    


    public function generatePDF($id)
    {
        $userId = Auth::id();
        $screening = Patients::with(['answers.question', 'physicalExaminations'])
            ->where('user_id', $userId)
            ->findOrFail($id);

        // Ambil nama pasien
        $patientName = str_replace(' ', '_', $screening->name); // Ganti spasi dengan underscore untuk nama file yang valid

        // Mengonversi data menjadi PDF
        $pdf = PDF::loadView('pdf.screenings.offline', [
            'screening' => $screening,
        ]);

        // Download PDF dengan nama sesuai nama pasien
        return $pdf->download('screening_detail_' . $patientName . '.pdf');
    }
}
