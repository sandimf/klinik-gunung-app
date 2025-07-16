<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\Users\PatientsOnline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ParamedisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $waitingCount = \App\Models\Users\Patients::where('screening_status', 'pending')->count();
        $sehatCount = \App\Models\Users\Patients::where('health_status', 'sehat')->count();
        $tidakSehatCount = \App\Models\Users\Patients::where('health_status', 'tidak_sehat')->count();
        $finishedCount = \App\Models\Users\Patients::where('screening_status', 'completed')->count();
        $waitingList = \App\Models\Users\Patients::where('screening_status', 'pending')
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['id', 'name', 'created_at']);

        return Inertia::render('Dashboard/Paramedis/Index', [
            'waitingCount' => $waitingCount,
            'sehatCount' => $sehatCount,
            'tidakSehatCount' => $tidakSehatCount,
            'finishedCount' => $finishedCount,
            'waitingList' => $waitingList,
        ]);
    }

    // test pdf
    // public function index()
    // {
    //     return view('pdf.screening');
    // }

    public function profile()
    {
        return Inertia::render('Profile/Paramedis');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    public function showScreeningOnlineDetail($id)
    {
        $patient = PatientsOnline::with(['answers.question'])
            ->findOrFail($id);

        $questionsAndAnswers = $patient->answers->map(function ($answer) {
            $answerText = $answer->answer_text;

            // Parse JSON jika jawaban adalah JSON string (untuk checkbox_textarea)
            if (is_string($answerText) && (str_starts_with($answerText, '{') || str_starts_with($answerText, '['))) {
                try {
                    $parsed = json_decode($answerText, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        // Jika berhasil parse JSON, format sesuai struktur
                        if (isset($parsed['options']) && isset($parsed['textarea'])) {
                            $options = $parsed['options'];
                            $textarea = $parsed['textarea'];

                            if ($options === 'N/A' && empty($textarea)) {
                                $answerText = 'Tidak';
                            } elseif ($options === 'N/A') {
                                $answerText = $textarea;
                            } elseif (empty($textarea)) {
                                $answerText = $options;
                            } else {
                                $answerText = $options.' - '.$textarea;
                            }
                        } else {
                            $answerText = is_array($parsed) ? implode(', ', $parsed) : $parsed;
                        }
                    }
                } catch (\Exception $e) {
                    // Jika gagal parse, gunakan string asli
                }
            }

            return [
                'question' => $answer->question->question_text,
                'answer' => $answerText,
                'queue' => $answer->queue, // Menambahkan nomor antrian
            ];
        });

        return Inertia::render('Dashboard/Paramedis/Screenings/Online/Details/Index', [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'queue' => $patient->answers->max('queue'),
        ]);
    }

    // Edit Quesioner Jawaban pasien
    public function update(Request $request, $id)
    {
        // Validasi untuk memastikan jawaban ada
        $request->validate([
            'answer' => 'required|array', // Pastikan 'answer' adalah array
        ]);

        // Loop untuk memperbarui jawaban satu per satu
        foreach ($request->answer as $answerData) {
            // Cari jawaban berdasarkan id
            $answer = ScreeningAnswers::findOrFail($id);

            // Pastikan 'answer' ada di dalam data
            if (isset($answerData)) {
                // Perbarui jawaban
                $answer->answer_text = $answerData;
                $answer->save();
            } else {
                // Jika 'answer' tidak ditemukan, berikan feedback
                return redirect()->back()->with('error', 'Gagal Menyimpan Jawaban');
            }
        }

        return redirect()->back()->with('message', 'Berhasil Menyimpan Jawaban');
    }

}
