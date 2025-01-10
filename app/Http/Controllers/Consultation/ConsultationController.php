<?php

namespace App\Http\Controllers\Consultation;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Users\Patients;
use App\Http\Controllers\Controller;

class ConsultationController extends Controller
{
    public function index(){
        $patients = Patients::all();
        return Inertia::render('Dashboard/Doctor/Consultation/Index',[
            'patients' => $patients
        ]);
    }

    public function create(){
        return Inertia::render('Dashboard/Doctor/Consultation/New');
    }
}
