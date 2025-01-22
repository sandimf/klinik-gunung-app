<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use App\Http\Requests\Information\PatientsInformationRequest;
use App\Models\Ai\Apikey;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PatientsDataController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $apiKey = Apikey::first()?->api_key;
        // Cari data pasien terkait user yang login
        $patient = $user->patient; // Relasi harus sudah diatur di model User
        return Inertia::render('Dashboard/Patients/DataPatients/Index', [
            'patient' => $patient, // Kirim data pasien jika ada
            'apiKey' => $apiKey,
        ]);
    }

    public function store(PatientsInformationRequest $request)
    {
        // Validasi input
        $validated = $request->validated();

        // Pastikan semua teks diformat dengan ucwords

        if ($request->hasFile('ktp_images')) {
            $image = $request->file('ktp_images');
            $imagePath = $image->store('ktp_images', 'public'); // Menyimpan di storage/app/public/ktp_images
            $validated['ktp_images'] = $imagePath; // Menyimpan path gambar di database
        }

        $validated['email'] = strtolower($validated['email']);
        
        // Simpan data pasien ke dalam database
        Patients::create([
            'user_id' => Auth::id(),
            'nik' => $validated['nik'],
            'name' => $validated['name'],
            'place_of_birth' => $validated['place_of_birth'],
            'date_of_birth' => $validated['date_of_birth'],
            'rt_rw' => $validated['rt_rw'],
            'address' => $validated['address'],
            'village' => $validated['village'],
            'district' => $validated['district'],
            'religion' => $validated['religion'],
            'marital_status' => $validated['marital_status'],
            'occupation' => $validated['occupation'],
            'nationality' => $validated['nationality'],
            'gender' => $validated['gender'],
            'email' => $validated['email'],
            'age' => $validated['age'],
            'blood_type' => $validated['blood_type'],
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
            'religion' => $validated['religion'],
            'marital_status' => $validated['marital_status'],
            'occupation' => $validated['occupation'],
            'nationality' => $validated['nationality'],
            'gender' => $validated['gender'],
            'email' => $validated['email'],
            'age' => $validated['age'] ?? null,
            'blood_type' => $validated['blood_type'],
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
            ->with('message', 'Profil pasien berhasil dibuat.');
    }
}
