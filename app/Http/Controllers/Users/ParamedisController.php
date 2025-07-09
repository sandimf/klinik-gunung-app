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
                return redirect()->back()->with('error', 'Gagal Menyimpan Jawaban');
            }
        }

        return redirect()->back()->with('message', 'Berhasil Menyimpan Jawaban');
    }

    /**
     * Update only the physical attributes (tinggi_badan, berat_badan) of a patient.
     */
    public function updatePhysicalAttributes(Request $request, $id)
    {
        $validated = $request->validate([
            'tinggi_badan' => 'nullable|integer|min:1',
            'berat_badan' => 'nullable|integer|min:1',
        ]);

        $patient = \App\Models\Users\Patients::findOrFail($id);
        $patient->update($validated);

        return back()->with('success', 'Data fisik pasien berhasil diperbarui.');
    }

    public function showScreenings(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 20;
        $search = $request->input('search');
        $cacheKey = "screenings:offline:{$page}:{$perPage}:{$search}";
        $offline = DB::table('patients')
            ->select('patients.id', 'patients.uuid', 'patients.name', 'patients.screening_status', 'q.queue')
            ->join(DB::raw('(
                SELECT patient_id, MIN(queue) as queue
                FROM screening_offline_answers
                WHERE answer_text IS NOT NULL
                GROUP BY patient_id
            ) as q'), 'patients.id', '=', 'q.patient_id')
            ->where('patients.screening_status', 'pending');
        if ($search) {
            $offline->where('patients.name', 'like', '%'.$search.'%');
        }
        $offline = $offline
            ->orderBy('q.queue', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);
        $online = [];

        return Inertia::render('Dashboard/Paramedis/Screenings/Index', [
            'screenings_offline' => $offline,
            'screenings_online' => $online,
        ]);
    }
}
