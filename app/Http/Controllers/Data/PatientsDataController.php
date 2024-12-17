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
        dd($request->all());
        // Validasi input
        $validated = $request->validate([
            'nik' => 'required|string|unique:patients,nik|max:20',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:patients,email',
            'age' => 'nullable|integer|min:0',
            'gender' => 'nullable|in:male,female,other',
            'contact' => 'nullable|string|max:15',
        ]);

        // Simpan data pasien ke dalam database
        Patients::create([
            'user_id' => Auth::id(),
            'nik' => $validated['nik'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'age' => $validated['age'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'contact' => $validated['contact'] ?? null,
        ]);

        // Redirect dengan pesan sukses
        return redirect()
            ->route('appointments.index')
            ->with('success', 'Patient profile created successfully.');
    }

}
