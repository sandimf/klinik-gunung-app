<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
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

    public function profile()
    {
        return Inertia::render('Profile/Paramedis');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function showScreeningOffline()
    {
        // Ambil screening dengan pertanyaan dan jawaban terkait
        $screenings = Patients::with(['answers.question'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text'); // Pastikan ada jawaban
            })
            ->where('screening_status', 'pending') // Pastikan status screening adalah pending
            ->get();

        // Pisahkan screening ke dalam dua kategori berdasarkan kondisi


        $screenings = $screenings->filter(function ($screening) {
            return !$screening->answers->some(function ($answer) {
                // Cek apakah ada jawaban yang sesuai dengan condition_value untuk pertanyaan yang memerlukan dokter
                return $answer->question->requires_doctor &&
                    $answer->answer_text == $answer->question->condition_value;
            });
        });

        return Inertia::render('Dashboard/Paramedis/Screenings/Offline/Index', [
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
        return Inertia::render('Dashboard/Paramedis/Screenings/Offline/Details/Index', [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'queue' => $patient->answers->max('queue'),
        ]);
    }

    // Menampilkan history pemeriksaan screening Offline Dan Onlin
    public function showHistoryScreening()
    {
        // Query screenings from Patients model
        $offlineScreenings = Patients::with(['answers.question'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'completed')
            ->get();

        // Query screenings from PatientsOnline model
        $onlineScreenings = PatientsOnline::with(['answers.question'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'completed')
            ->get();

        // Combine both offline and online screenings into a single collection
        $screenings = collect([])->merge($offlineScreenings)->merge($onlineScreenings);

        // Return to the Inertia view with screenings data
        return Inertia::render('Dashboard/Paramedis/Screenings/History/Index', [
            'screenings' => $screenings->all(), // Ensure screenings is returned as an array
        ]);
    }

    // Menampilkan Screening Onlin
    public function showScreeningOnline()
    {
        $screenings = PatientsOnline::with(['answers.question'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'pending') // Tambahkan kondisi untuk screening_status
            ->where('payment_status', 'completed') // Tambahkan kondisi untuk payment_status
            ->where('scan_status', 'completed') // Tambahkan kondisi untuk hanya menampilkan scan_status 'completed'
            ->get();
    
        return Inertia::render('Dashboard/Paramedis/Screenings/Online/Index', [
            'screenings' => $screenings,
        ]);
    }
    
    
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
}
