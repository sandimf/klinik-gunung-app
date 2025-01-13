<?php

namespace App\Http\Controllers\Users;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Users\Manager;
use App\Models\Users\Patients;
use App\Http\Controllers\Controller;
use App\Models\Users\PatientsOnline;

class ManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Dashboard/Manager/Index');
    }

    public function profile()
    {
        return Inertia::render('Profile/Manager');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function screening()
    {
        // Query screenings from Patients model (Offline)
        $offlineScreenings = Patients::with(['answers.question', 'physicalExaminations.paramedis', 'physicalExaminations.doctor'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->get();
    
        // Query screenings from PatientsOnline model (Online)
        $onlineScreenings = PatientsOnline::with(['answers.question', 'physicalExaminations.paramedis', 'physicalExaminations.doctor'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'completed')
            ->get();
    
        // Gabungkan data screening offline dan online ke dalam satu koleksi
        $screenings = collect([])->merge($offlineScreenings)->merge($onlineScreenings);
        // Kembalikan ke tampilan Inertia dengan data screenings
        return Inertia::render('Dashboard/Manager/Screenings/Index', [
            'screenings' => $screenings->all(),
        ]);
    }
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
 }

    /**
     * Display the specified resource.
     */
    public function show(Manager $manager)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Manager $manager)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Manager $manager)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Manager $manager)
    {
        //
    }
}
