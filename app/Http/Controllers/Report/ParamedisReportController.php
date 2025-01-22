<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\Clinic\PhysicalExamination;
use App\Models\Users\Paramedis;
use App\Models\Users\Patients;
use Barryvdh\DomPDF\Facade\pdf;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ParamedisReportController extends Controller
{
    public function index()
    {
        $userId = Auth::id(); // Ambil ID user yang login

        // Cari paramedis berdasarkan user ID
        $paramedis = Paramedis::where('user_id', $userId)->first();

        // Pastikan paramedis ditemukan
        if (! $paramedis) {
            return back()->withErrors('Paramedis tidak ditemukan');
        }

        // Ambil data pemeriksaan fisik yang dilakukan oleh paramedis ini
        $examinations = PhysicalExamination::with('patient') // Ambil data pasien terkait
            ->where('paramedis_id', $paramedis->id)
            ->get();

        // Hitung total jumlah pasien yang diperiksa
        $totalPatients = $examinations->count();

        // Hitung jumlah pasien yang sakit
        $sickPatientsCount = $examinations->where('health_status', 'butuh_dokter')->count();

        // Ambil nama-nama pasien
        $patients = $examinations->map(function ($examination) {
            return [
                'id' => $examination->patient->id,
                'uuid' => $examination->patient->uuid,
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

    public function activity()
    {
        // Ambil semua data pemeriksaan fisik dan relasi dengan pasien serta paramedis
        $examinations = PhysicalExamination::with(['patient', 'paramedis'])->get();

        // Hitung total jumlah pasien yang diperiksa
        $totalPatients = $examinations->count();

        // Hitung jumlah pasien yang sakit
        $sickPatientsCount = $examinations->where('health_status', 'butuh_dokter')->count();

        // Hitung total jumlah paramedis yang terlibat
        $totalParamedis = $examinations->pluck('paramedis_id')->unique()->count();

        // Ambil nama-nama pasien beserta paramedis yang memeriksa
        $patients = $examinations->map(function ($examination) {
            return [
                'id' => $examination->patient->id,
                'name' => $examination->patient->name,
                'health_status' => $examination->health_status,
                'date_of_birth' => $examination->patient->date_of_birth,
                'gender' => $examination->patient->gender,
                'examined_by' => $examination->paramedis->name ?? 'Tidak Diketahui', // Nama paramedis
            ];
        });

        // Kirim data ke frontend
        return Inertia::render('Dashboard/Paramedis/Activity/Index', [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
            'totalParamedis' => $totalParamedis, // Menambahkan jumlah paramedis
        ]);
    }

    public function generatePDFActivity()
    {
        // Ambil semua data pemeriksaan fisik dan relasi dengan pasien serta paramedis
        $examinations = PhysicalExamination::with(['patient', 'paramedis'])->get();

        // Hitung total jumlah pasien yang diperiksa
        $totalPatients = $examinations->count();

        // Hitung jumlah pasien yang sakit
        $sickPatientsCount = $examinations->where('health_status', 'butuh_dokter')->count();

        // Hitung total jumlah paramedis yang terlibat
        $totalParamedis = $examinations->pluck('paramedis_id')->unique()->count();

        // Ambil nama-nama pasien beserta paramedis yang memeriksa
        $patients = $examinations->map(function ($examination) {
            return [
                'id' => $examination->patient->id,
                'name' => $examination->patient->name,
                'health_status' => $examination->health_status,
                'date_of_birth' => $examination->patient->date_of_birth,
                'gender' => $examination->patient->gender,
                'examined_by' => $examination->paramedis->name ?? 'Tidak Diketahui', // Nama paramedis
            ];
        });

        // Menyusun data yang akan dikirim ke view untuk PDF
        $data = [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
            'totalParamedis' => $totalParamedis,
        ];

        // Load view dengan data untuk di-render menjadi PDF
        $pdf = Pdf::loadView('pdf.activity.paramedis.activity', $data);

        // Download PDF
        return $pdf->download('activity_report.pdf');
    }

    public function generatePDFHealthCheck($id)
    {
        // Ambil data screening pasien beserta jawaban dan pemeriksaan fisik
        $screening = Patients::with(['answers.question', 'physicalExaminations.paramedis']) // Ambil data paramedis juga
            ->where('id', $id)
            ->firstOrFail(); // Pastikan pasien ditemukan

        // Ambil nama pasien untuk penamaan file PDF
        $patientName = str_replace(' ', '_', $screening->name); // Ganti spasi dengan underscore untuk nama file yang valid

        // Ambil data pemeriksaan fisik dan paramedis yang memeriksa
        $examinations = $screening->physicalExaminations;  // Mengambil semua pemeriksaan fisik yang terkait

        // Menyusun data untuk PDF
        $data = [
            'screening' => $screening,
            'examinations' => $examinations, // Kirim data pemeriksaan fisik
        ];

        // Mengonversi data menjadi PDF
        $pdf = PDF::loadView('pdf.activity.paramedis.health', $data);

        // Download PDF dengan nama yang sesuai
        return $pdf->download('health_check_'.$patientName.'.pdf');
    }

    // generate pdf  pemeriksaan yang dilakukan paramedis

    public function generatePDFself()
    {
        $userId = Auth::id();

        // Cari paramedis berdasarkan user ID
        $paramedis = Paramedis::where('user_id', $userId)->first();

        // Pastikan paramedis ditemukan
        if (! $paramedis) {
            return back()->withErrors('Paramedis tidak ditemukan');
        }

        // Ambil data pemeriksaan fisik yang dilakukan oleh paramedis ini
        $examinations = PhysicalExamination::with('patient') // Ambil data pasien terkait
            ->where('paramedis_id', $paramedis->id)
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

        // Menyusun data yang akan dikirim ke view untuk PDF
        $data = [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
        ];

        // Load view dengan data untuk di-render menjadi PDF
        $pdf = PDF::loadView('pdf.activity.paramedis.self', $data);

        // Download PDF
        return $pdf->download('my_report.pdf');
    }
}
