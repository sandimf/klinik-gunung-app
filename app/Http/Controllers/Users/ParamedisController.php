<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Users\Paramedis;
use App\Models\Users\Patients;
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
        $screenings = Patients::with(['answers.question'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->get();

        return Inertia::render('Dashboard/Paramedis/Screenings/Offline/Index', [
            'screenings' => $screenings,
        ]);
    }
    public function show($id)
    {
       
        $patient = Patients::with(['answers.question'])
            ->findOrFail($id); // Mencari pasien berdasarkan ID yang diberikan
    
        // Kembalikan data ke Inertia untuk menampilkan halaman detail
        return Inertia::render('Dashboard/Paramedis/Screenings/Offline/Details/Index', [
            'patient' => $patient, // Mengirim data pasien untuk ditampilkan
        ]);
    }
}
