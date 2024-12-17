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
            ->where('status', 'pending')
            ->latest('created_at')
            ->get();
        
        return Inertia::render('Dashboard/Doctor/Appointments/Index', [
            'appointments' => $appointments,
        ]);
        
    }

    // Confirmasi Appointsment
    public function store(Request $request)
    {
        // Validasi data
        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'status' => 'required|string',
        ]);
    
        // Update status appointment
        $appointment = Appointments::findOrFail($validated['appointment_id']);
        $appointment->status = $validated['status'];
        $appointment->save();
    
        // Redirect ke halaman medical record dengan parameter appointment_id
        return redirect()->route('appointments.emr', ['appointment_id' => $appointment->id])
            ->with('success', 'Appointment confirmed successfully. Redirecting to medical records.');
    }


        public function show($appointment_id)
        {
            // Ambil data appointment berdasarkan ID
            $appointment = Appointments::with(['patient'])->findOrFail($appointment_id);
    
            // Return ke halaman medical record
            return inertia('Dashboard/Doctor/Appointments/MedicalRecord', [
                'appointment' => $appointment,
            ]);
        }
    
    public function history() {
        
        $appointments = Appointments::with('patient')
            ->whereIn('status', ['confirmed', 'pending']) // Menggunakan whereIn untuk kondisi OR
            ->latest('created_at') // Urutkan berdasarkan created_at
            ->get();
    
        return Inertia::render('Dashboard/Doctor/Appointments/HistoryAppointments/Index', [
            'appointments' => $appointments // Mengirim data ke Inertia
        ]);
    }
    
}
