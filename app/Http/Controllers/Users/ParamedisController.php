<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\Screenings\ScreeningOnlineAnswers;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParamedisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Dashboard/Paramedis/Index');
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

    /**
     * show screening offline
     */
    // public function showScreeningOffline()
    // {
    //     // Ambil screening dengan pertanyaan dan jawaban terkait
    //     $screenings = Patients::with(['answers.question'])
    //         ->whereHas('answers', function ($query) {
    //             $query->whereNotNull('answer_text'); // Pastikan ada jawaban
    //         })
    //         ->where('screening_status', 'pending') // Pastikan status screening adalah pending
    //         ->get();

    //     // Pisahkan screening ke dalam dua kategori berdasarkan kondisi

    //     $screenings = $screenings->filter(function ($screening) {
    //         return ! $screening->answers->some(function ($answer) {
    //             // Cek apakah ada jawaban yang sesuai dengan condition_value untuk pertanyaan yang memerlukan dokter
    //             return $answer->question->requires_doctor &&
    //                 $answer->answer_text == $answer->question->condition_value;
    //         });
    //     });

    //     return Inertia::render('Dashboard/Paramedis/Screenings/Offline/Index', [
    //         'screenings' => $screenings,
    //     ]);
    // }


    // Menampilkan Screening Online
    // public function showScreeningOnline()
    // {
    //     $screenings = PatientsOnline::with(['answers.question'])
    //         ->whereHas('answers', function ($query) {
    //             $query->whereNotNull('answer_text');
    //         })
    //         ->where('screening_status', 'pending') // Tambahkan kondisi untuk screening_status
    //         ->where('payment_status', 'completed') // Tambahkan kondisi untuk payment_status
    //         ->where('scan_status', 'completed') // Tambahkan kondisi untuk hanya menampilkan scan_status 'completed'
    //         ->get();

    //     return Inertia::render('Dashboard/Paramedis/Screenings/Online/Index', [
    //         'screenings' => $screenings,
    //     ]);
    // }

    public function showScreeningOnlineDetail($id)
    {
        $patient = PatientsOnline::with(['answers.question'])
            ->findOrFail($id);

        $questionsAndAnswers = $patient->answers->map(function ($answer) {
            return [
                'question' => $answer->question->question_text,
                'answer' => $answer->answer_text,
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
                return redirect()->back()->with('error', 'API Key has been successfully saved or updated');
            }
        }

        return redirect()->back()->with('message', 'Berhasil Menyimpan Jawaban');
    }

    public function showScreenings()
    {
        // Ambil screening offline
        $offline = Patients::with(['answers.question'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'pending')
            ->get()
            ->map(function ($item) {
                $item->screening_type = 'offline';
                return $item;
            });

        // Ambil screening online
        $online = PatientsOnline::with(['answers.question'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'pending')
            ->where('payment_status', 'completed')
            ->where('scan_status', 'completed')
            ->get()
            ->map(function ($item) {
                $item->screening_type = 'online';
                return $item;
            });

        // Gabungkan
        $screenings = $offline->concat($online)->values();

        return Inertia::render('Dashboard/Paramedis/Screenings/Index', [
            'screenings' => $screenings,
        ]);
    }
}
