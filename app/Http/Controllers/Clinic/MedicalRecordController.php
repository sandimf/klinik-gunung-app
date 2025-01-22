<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\EMR\MedicalRecord;
use Inertia\Inertia;

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
