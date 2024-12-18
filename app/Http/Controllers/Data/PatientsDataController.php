<?php

namespace App\Http\Controllers\Data;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Users\Patients;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PatientsDataController extends Controller
{
    public function index()
    {
        $user = Auth::user();
    
        // Cari data pasien terkait user yang login
        $patient = $user->patient; // Relasi harus sudah diatur di model User
    
        return Inertia::render('Dashboard/Patients/DataPatients/Index', [
            'patient' => $patient, // Kirim data pasien jika ada
        ]);
    }
    

    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'nik' => 'required|string|unique:patients,nik|max:16',
            'name' => 'required|string|max:255',
            'place_of_birth' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'rt_rw' => 'nullable|string|max:10',
            'address' => 'required|string|max:255',
            'village' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            // 'city' => 'required|string|max:255',
            'religion' => 'required|string|max:50',
            'marital_status' => 'required|string|max:50',
            'occupation' => 'required|string|max:255',
            'nationality' => 'required|string|max:50',
            'gender' => 'nullable|in:male,female,other',
            'email' => 'required|email|unique:patients,email|max:255',
            'age' => 'nullable|integer|min:0',
            'contact' => 'required|string|unique:patients,contact|max:15',
            'ktp_images' => 'nullable|string|max:255',
            'screening_status' => 'nullable|in:completed,pending,cancelled',
            'health_status' => 'nullable|in:pending,healthy,sick,under treatment',
            'health_check_status' => 'nullable|in:pending,completed',
            'payment_status' => 'nullable|in:completed,pending,cancelled',
        ]);

        // Simpan data pasien ke dalam database
        Patients::create([
            'user_id' => Auth::id(),
            'nik' => $validated['nik'],
            'name' => $validated['name'],
            'place_of_birth' => $validated['place_of_birth'],
            'date_of_birth' => $validated['date_of_birth'],
            'rt_rw' => $validated['rt_rw'] ?? null,
            'address' => $validated['address'],
            'village' => $validated['village'],
            'district' => $validated['district'],
            // 'city' => $validated['city'],
            'religion' => $validated['religion'],
            'marital_status' => $validated['marital_status'],
            'occupation' => $validated['occupation'],
            'nationality' => $validated['nationality'],
            'gender' => $validated['gender'] ?? null,
            'email' => $validated['email'],
            'age' => $validated['age'] ?? null,
            'contact' => $validated['contact'],
            'ktp_images' => $validated['ktp_images'] ?? null,
            'screening_status' => $validated['screening_status'] ?? null,
            'health_status' => $validated['health_status'] ?? null,
            'health_check_status' => $validated['health_check_status'] ?? null,
            'payment_status' => $validated['payment_status'] ?? null,
        ]);

        // Redirect dengan pesan sukses
        return redirect()
            ->route('appointments.index') // Ganti sesuai rute yang relevan jika berbeda
            ->with('success', 'Patient profile created successfully.');
    }

}
