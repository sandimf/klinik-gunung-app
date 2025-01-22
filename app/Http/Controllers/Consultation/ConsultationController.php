<?php

namespace App\Http\Controllers\Consultation;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    public function index()
    {
        $patients = Patients::all();

        return Inertia::render('Dashboard/Doctor/Consultation/Index', [
            'patients' => $patients,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Doctor/Consultation/New');
    }
}
