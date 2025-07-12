<?php

namespace App\Http\Controllers\Roles\Cashier\MedicalRecord;

use App\Http\Controllers\Controller;
use App\Models\EMR\MedicalRecord;
use Inertia\Inertia;

class CashierMedicalRecordController extends Controller
{
    public function index()
    {
        // Ambil semua medical record beserta relasi pasien dan pemeriksaan fisik
        $medicalRecords = MedicalRecord::with([
            'patient.user:id,name,avatar',
            'physicalExamination',
        ])->get();

        // Kirimkan data ke halaman Inertia
        return Inertia::render('Dashboard/Cashier/MedicalRecord/Index', [
            'medicalRecords' => $medicalRecords,
        ]);
    }

    public function show($uuid)
    {
        $medicalRecord = MedicalRecord::with(['patient', 'physicalExamination'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia::render('Dashboard/Cashier/MedicalRecord/Detail', [
            'medicalRecord' => $medicalRecord,
        ]);
    }
}
