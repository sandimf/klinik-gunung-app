<?php

namespace App\Http\Controllers\Roles\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use Inertia\Inertia;

class DoctorDashboardController extends Controller
{
    public function index()
    {
        $waitingConsultationCount = Patients::where('konsultasi_dokter', 1)->count();

        return Inertia::render('Dashboard/Doctor/Index', [
            'waitingConsultationCount' => $waitingConsultationCount,
        ]);
    }
}
