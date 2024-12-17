<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Activity\UserVisit;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PatientsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
        if (Auth::check()) {
            $todayVisit = UserVisit::where('user_id', $userId)
                ->whereDate('visit_date', now()->toDateString())
                ->first();

            if (! $todayVisit) {
                UserVisit::create([
                    'user_id' => $userId,
                    'visit_date' => now(),
                ]);
            }
        }
        $visitCount = UserVisit::where('user_id', $userId)
            ->where('visit_date', '>=', now()->subMonths(3))
            ->count();

        return Inertia::render('Dashboard/Patients/Index', [
            'visitCount' => $visitCount,
        ]);
    }

    public function profile()
    {
        return Inertia::render('Profile/Patients');
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
     * Display the specified resource.
     */
    public function show(Patients $patients)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patients $patients)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patients $patients)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patients $patients)
    {
        //
    }
}
