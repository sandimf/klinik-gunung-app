<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Activity\UserVisit;
use App\Models\Users\Patients;
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
        $user = Auth::user();
        $patient = Patients::where('user_id', $user->id)->first();

        if (!$patient) {
            // Redirect ke halaman untuk melengkapi data pasien
            return redirect()->route('information.index')
                ->with('warning', 'Please complete your patient profile before accessing appointments.');
        }
        return Inertia::render('Profile/Patients');
    }

}
