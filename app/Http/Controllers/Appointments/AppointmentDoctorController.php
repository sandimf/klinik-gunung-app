<?php

namespace App\Http\Controllers\Appointments;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Clinic\Appointments;
use App\Http\Controllers\Controller;

class AppointmentDoctorController extends Controller
{
    public function index(){
        // Asumsi Anda memiliki relasi antara doctor dan appointments
        $appointments = Appointments::with('patient')
            ->where('status', 'pending') // Filter hanya status "pending"
            ->latest('created_at') // Urutkan berdasarkan created_at
            ->get();
        
        return Inertia::render('Dashboard/Doctor/Appointments/Index', [
            'appointments' => $appointments,
        ]);
        
    }
}
