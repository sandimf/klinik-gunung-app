<?php

namespace App\Http\Controllers\Appointments;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Users\Patients;
use App\Models\Clinic\Appointments;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
    
        // Periksa apakah data pasien ada di tabel `patients`
        $patient = Patients::where('user_id', $user->id)->first();
    
        if (!$patient) {
            // Redirect ke halaman untuk melengkapi data pasien
            return redirect()->route('information.index')
                ->with('warning', 'Please complete your patient profile before accessing appointments.');
        }
    
        $appointments = Appointments::where('patient_id', $patient->id)
            ->latest('appointment_date')
            ->get();
    
        return Inertia::render('Dashboard/Patients/Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }
    

    public function store(Request $request)
    {
        // Ambil user yang sedang login
        $user = Auth::user();

        // Validasi input
        $validated = $request->validate([
            'appointment_date' => 'required|date',
            'is_scheduled' => 'required|boolean',
        ]);

        // Simpan data ke database
        $appointment = Appointments::create([
            'appointment_date' => $validated['appointment_date'],
            'is_scheduled' => $validated['is_scheduled'],
            'patient_id' => $user->id, // Ambil ID pasien dari pengguna yang sedang login
        ]);

        // Berikan respon sukses
        return response()->json([
            'message' => 'Appointment created successfully!',
            'appointment' => $appointment,
        ], 201);
    }


    public function update(){
        
    }
}
