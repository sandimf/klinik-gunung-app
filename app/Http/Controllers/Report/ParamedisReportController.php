<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\Clinic\PhysicalExamination;
use App\Models\Users\Paramedis;
use App\Models\Users\Patients;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Storage;
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
        $examinations = PhysicalExamination::with('patient:id,uuid,name,date_of_birth,gender') // Hanya ambil field yang diperlukan
            ->where('paramedis_id', $paramedis->id)
            ->get();

        // Hitung total jumlah pasien yang diperiksa
        $totalPatients = $examinations->count();

        // Hitung jumlah pasien berdasarkan status kesehatan
        $healthCounts = $examinations->groupBy('health_status')->map->count();
        $sickPatientsCount = $healthCounts->get('tidak_sehat', 0);
        $healthyPatientsCount = $healthCounts->get('sehat', 0);

        // Ambil data pasien dengan validasi null
        $patients = $examinations->map(function ($examination) {
            $patient = $examination->patient;

            return [
                'id' => $patient->id ?? null,
                'uuid' => $patient->uuid ?? null,
                'name' => $patient->name ?? 'Tidak Diketahui',
                'health_status' => $examination->health_status,
                'date_of_birth' => $patient->date_of_birth ?? null,
                'gender' => $patient->gender ?? null,
            ];
        });

        // Kirim data ke frontend
        return Inertia::render('Dashboard/Paramedis/Report/Index', [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
            'healthyPatientsCount' => $healthyPatientsCount,
        ]);
    }

    public function activity()
    {
        $filter = Request::input('filter', 'all');
        $startDate = null;
        $endDate = null;

        switch ($filter) {
            case 'daily':
                $startDate = Carbon::today();
                $endDate = Carbon::tomorrow();
                break;
            case 'weekly':
                $startDate = Carbon::now()->startOfWeek();
                $endDate = Carbon::now()->endOfWeek();
                break;
            case 'monthly':
                $startDate = Carbon::now()->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                break;
        }

        $query = PhysicalExamination::with(['patient', 'paramedis']);

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $examinations = $query->get();

        // Rest of your code remains the same
        $totalPatients = $examinations->count();
        $sickPatientsCount = $examinations->where('health_status', 'tidak_sehat')->count();
        $healthyPatientsCount = $examinations->where('health_status', 'sehat')->count();
        $totalParamedis = $examinations->pluck('paramedis_id')->unique()->count();

        $patients = $examinations->map(function ($examination) {
            return [
                'id' => $examination->patient->id,
                'name' => $examination->patient->name,
                'health_status' => $examination->health_status,
                'date_of_birth' => $examination->patient->date_of_birth,
                'gender' => $examination->patient->gender,
                'examined_by' => $examination->paramedis->name ?? 'Tidak Diketahui',
                'examined_at' => $examination->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('Dashboard/Paramedis/Activity/Index', [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
            'totalParamedis' => $totalParamedis,
            'healthyPatientsCount' => $healthyPatientsCount,
            'currentFilter' => $filter,
        ]);
    }

    public function generatePDFActivity(Request $request)
    {
        $filter = Request::input('filter', 'all'); // Perbaikan pengambilan input
        $startDate = null;
        $endDate = null;

        switch ($filter) {
            case 'daily':
                $startDate = Carbon::today();
                $endDate = Carbon::tomorrow();
                break;
            case 'weekly':
                $startDate = Carbon::now()->startOfWeek();
                $endDate = Carbon::now()->endOfWeek();
                break;
            case 'monthly':
                $startDate = Carbon::now()->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                break;
        }

        $query = PhysicalExamination::with(['patient', 'paramedis']);

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $examinations = $query->get();

        // Hitung statistik
        $totalPatients = $examinations->count();
        $sickPatientsCount = $examinations->where('health_status', 'tidak_sehat')->count();
        $healthyPatientsCount = $examinations->where('health_status', 'sehat')->count();
        $totalParamedis = $examinations->pluck('paramedis_id')->unique()->count();

        // Format data pasien
        $patients = $examinations->map(function ($examination) {
            return [
                'id' => $examination->patient->id,
                'name' => $examination->patient->name,
                'health_status' => $examination->health_status,
                'date_of_birth' => $examination->patient->date_of_birth,
                'gender' => $examination->patient->gender,
                'examined_by' => $examination->paramedis->name ?? 'Tidak Diketahui',
                'examined_at' => $examination->created_at->format('Y-m-d H:i:s'),
            ];
        });

        // Format tanggal untuk tampilan dan nama file
        $formattedStartDate = $startDate ? $startDate->format('Y-m-d') : 'all';
        $formattedEndDate = $endDate ? $endDate->format('Y-m-d') : 'all';
        $dateRange = $startDate && $endDate ? "{$formattedStartDate} to {$formattedEndDate}" : 'All Time';

        // Data untuk PDF
        $data = [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
            'totalParamedis' => $totalParamedis,
            'healthyPatientsCount' => $healthyPatientsCount,
            'filter' => ucfirst($filter), // Tampilkan nama filter di PDF
            'dateRange' => $dateRange, // Tambahkan rentang tanggal
        ];

        // Load view dengan data
        $pdf = Pdf::loadView('pdf.activity.paramedis.activity', $data);

        // Nama file sesuai filter dan tanggal
        return $pdf->download("activity_report_{$filter}_{$formattedStartDate}_{$formattedEndDate}.pdf");
    }

    // Menghasilkan pdf untuk setiap pasien
    public function generatePDFHealthCheck($uuid)
    {
        // Ambil data screening pasien beserta jawaban dan pemeriksaan fisik
        $screening = Patients::with(['answers.question', 'physicalExaminations.paramedis']) // Ambil data paramedis juga
            ->where('uuid', $uuid)
            ->firstOrFail(); // Pastikan pasien ditemukan

        // Ambil nama pasien untuk penamaan file PDF
        $patientName = str_replace(' ', '_', $screening->name); // Ganti spasi dengan underscore untuk nama file yang valid

        // Ambil data pemeriksaan fisik dan paramedis yang memeriksa
        $examinations = $screening->physicalExaminations;  // Mengambil semua pemeriksaan fisik yang terkait

        // Ambil pemeriksaan fisik terbaru (jika ada)
        $latestExamination = $examinations->sortByDesc('created_at')->first();
        $examiner = $latestExamination ? $latestExamination->paramedis : null;

        // Siapkan signature path jika ada
        $signaturePath = null;
        if ($examiner && $examiner->signature) {
            if (preg_match('/^data:image\\/(png|jpeg);base64,/', $examiner->signature, $matches)) {
                $ext = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
                $signatureData = substr($examiner->signature, strpos($examiner->signature, ',') + 1);
                $signatureData = base64_decode($signatureData);
                $filename = 'signatures/examiner_'.$examiner->id.'_'.time().'.'.$ext;
                Storage::disk('public')->put($filename, $signatureData);
                $signaturePath = storage_path('app/public/'.$filename);
            }
        }

        // Ambil medical record terbaru
        $medicalRecord = \App\Models\EMR\MedicalRecord::where('patient_id', $screening->id)
            ->latest()
            ->first();
        $medicalRecordNumber = $medicalRecord->medical_record_number ?? '-';
        $bulan = $medicalRecord ? ($medicalRecord->created_at ? $medicalRecord->created_at->format('n') : null) : null;
        $romawi = [
            1 => 'I',
            2 => 'II',
            3 => 'III',
            4 => 'IV',
            5 => 'V',
            6 => 'VI',
            7 => 'VII',
            8 => 'VIII',
            9 => 'IX',
            10 => 'X',
            11 => 'XI',
            12 => 'XII',
        ];
        $bulanRomawi = $bulan ? ($romawi[$bulan] ?? '-') : '-';

        // Menyusun data untuk PDF
        $data = [
            'screening' => $screening,
            'examinations' => $examinations, // Kirim data pemeriksaan fisik
            'medical_record_number' => $medicalRecordNumber,
            'bulan_romawi' => $bulanRomawi,
            'examiner_name' => $examiner ? $examiner->name : null,
            'examiner_signature_path' => $signaturePath,
        ];

        // Mengonversi data menjadi PDF
        $pdf = Pdf::loadView('pdf.screenings.health_check', $data);

        // Download PDF dengan nama yang sesuai
        return $pdf->download('hasil_pemeriksaan_'.$patientName.'.pdf');
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
        $examinations = PhysicalExamination::with('patient')
            ->where('paramedis_id', $paramedis->id)
            ->get();

        // Hitung total jumlah pasien yang diperiksa
        $totalPatients = $examinations->count();

        // Hitung jumlah pasien yang sakit
        $healthCounts = $examinations->groupBy('health_status')->map->count();
        // Use array access instead of get() method since $healthCounts is an array
        $sickPatientsCount = $healthCounts['tidak_sehat'] ?? 0;
        $healthyPatientsCount = $healthCounts['sehat'] ?? 0;
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

        // Menyusun data untuk view PDF
        $data = [
            'patients' => $patients,
            'totalPatients' => $totalPatients,
            'sickPatientsCount' => $sickPatientsCount,
            'healthyPatientsCount' => $healthyPatientsCount,
        ];

        // Load view dengan data
        $pdf = Pdf::loadView('pdf.activity.paramedis.self', $data);

        // Format nama file PDF
        $paramedisName = str_replace(' ', '_', $paramedis->name); // Ganti spasi dengan underscore
        $date = now()->format('Y-m-d'); // Format tanggal hari ini
        $fileName = "{$paramedisName}_{$date}.pdf";

        // Download PDF dengan nama file yang sesuai
        return $pdf->download($fileName);
    }
}
