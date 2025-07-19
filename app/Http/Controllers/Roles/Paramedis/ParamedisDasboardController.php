<?php

namespace App\Http\Controllers\Roles\Paramedis;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use Inertia\Inertia;

class ParamedisDasboardController extends Controller
{
    public function index()
    {
        $waitingCount = Patients::where('screening_status', 'pending')->count();
        $sehatCount = Patients::where('health_status', 'sehat')->count();
        $tidakSehatCount = Patients::where('health_status', 'tidak_sehat')->count();
        $finishedCount = Patients::where('screening_status', 'completed')->count();
        $waitingList = Patients::where('screening_status', 'pending')
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
}
