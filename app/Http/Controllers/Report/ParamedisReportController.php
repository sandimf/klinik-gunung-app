<?php

namespace App\Http\Controllers\Report;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Clinic\PhysicalExamination;

class ParamedisReportController extends Controller
{
    public function index()
    {
        $paramedisId = Auth::id(); // Ambil ID paramedis yang login
    
        // Ambil data pemeriksaan fisik yang dilakukan oleh paramedis ini
        $examinations = PhysicalExamination::with('patient') // Ambil data pasien terkait
            ->where('paramedis_id', $paramedisId)
            ->get();
    
        // Hitung total jumlah pasien yang diperiksa
        $totalPatients = $examinations->count();
    
        // Hitung jumlah pasien yang sakit
        $sickPatientsCount = $examinations->where('health_status', 'butuh_dokter')->count();
    
        // Ambil nama-nama pasien
        $patients = $examinations->map(function ($examination) {
            return [
                'id' => $examination->patient->id,
                'name' => $examination->patient->name,
                'health_status' => $examination->health_status,
                'date_of_birth' => $examination->patient->date_of_birth,
                'gender' => $examination->patient->gender,
            ];
        });
    
        // Kirim data ke frontend
        return Inertia::render('Dashboard/Paramedis/Report/Index', [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
        ]);
    }
    
}
