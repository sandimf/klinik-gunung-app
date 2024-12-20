<?php

namespace App\Http\Controllers\Data;

use App\Models\Users\PatientsOnline;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Users\Patients;
use App\Http\Controllers\Controller;
use App\Http\Requests\Information\PatientsInformationRequest;
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
    

    public function store(PatientsInformationRequest $request)
    {
        // Validasi input
        $validated = $request->validated();

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

        PatientsOnline::create([
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
            ->route('dashboard') // Ganti sesuai rute yang relevan jika berbeda
            ->with('message', 'Patient profile created successfully.');
    }

}
