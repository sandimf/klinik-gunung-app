<?php

namespace App\Http\Controllers\Clinic;

use Inertia\Inertia;
use App\Models\Users\Patients;
use App\Models\EMR\MedicalRecord;
use App\Http\Controllers\Controller;

class MedicalRecordController extends Controller
{
    public function index()
    {
        // Ambil semua medical record beserta relasi pasien dan pemeriksaan fisik
        $medicalRecords = MedicalRecord::with(['patient', 'physicalExamination'])->get();

        // Kirimkan data ke halaman Inertia
        return Inertia::render('Dashboard/Doctor/MedicalRecord/Index', [
            'medicalRecords' => $medicalRecords,
        ]);
    }

    public function show($id)
    {
        // Ambil data medical record dengan relasi pasien dan pemeriksaan fisik
        $medicalRecord = MedicalRecord::with(['patient', 'physicalExamination'])->findOrFail($id);
    
        // Kirimkan data ke halaman detail
        return Inertia::render('Dashboard/Doctor/MedicalRecord/Detail', [
            'medicalRecord' => $medicalRecord,
        ]);
    }
}
