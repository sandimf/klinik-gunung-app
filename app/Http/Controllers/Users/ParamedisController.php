<?php

namespace App\Http\Controllers\Users;

use App\Models\Users\Paramedis;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

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
            ->get();  // Paginate with 10 items per page

        return Inertia::render('Dashboard/Paramedis/Screenings/Offline/Index', [
            'screenings' => $screenings,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paramedis $paramedis)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Paramedis $paramedis)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paramedis $paramedis)
    {
        //
    }
}
