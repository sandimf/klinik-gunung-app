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
        $medicalRecords = MedicalRecord::with([
            'patient.user:id,name,avatar',
            'physicalExamination',
        ])->get();

        // Kirimkan data ke halaman Inertia
        return Inertia::render('Dashboard/Doctor/MedicalRecord/Index', [
            'medicalRecords' => $medicalRecords,
        ]);
    }

    public function show($uuid)
    {
        $medicalRecord = MedicalRecord::with(['patient.answers.question', 'physicalExamination'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia::render('Dashboard/Doctor/MedicalRecord/Detail', [
            'medicalRecord' => $medicalRecord,
        ]);
    }
}
