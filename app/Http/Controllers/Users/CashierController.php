<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Medicines\Medicine;
use App\Models\Users\Cashier;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Dashboard/Cashier/Index');
    }

    public function profile()
    {
        return Inertia::render('Profile/Cashier');
    }

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
     * Display screening offline
     */
    public function showScreeningOffline()
    {
        // Muat screening yang statusnya pending dan memiliki jawaban
        $screenings = Patients::with(['answers.question'])
            ->where('payment_status', 'pending')
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->get();

        // Muat semua obat
        $medicines = Medicine::with('pricing')->get();

        return Inertia::render('Dashboard/Cashier/Screenings/ScreeningOffline', [
            'screenings' => $screenings,
            'medicines' => $medicines,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cashier $cashier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cashier $cashier)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cashier $cashier)
    {
        //
    }
}
