<?php

namespace App\Http\Controllers\Screening;

use App\Http\Controllers\Controller;
use App\Http\Requests\Screenings\ScreeningOfflineRequest;
use App\Models\Users\Patients;
use App\Services\ScreeningPdfService;
use App\Services\ScreeningQueryService;
use App\Services\ScreeningSubmissionService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InClinicScreeningController extends Controller
{
    public function __construct(
        protected ScreeningQueryService $queryService,
        protected ScreeningSubmissionService $submissionService,
        protected ScreeningPdfService $pdfService
    ) {}

    public function index()
    {
        $patient = $this->queryService->findPatient(Auth::user());
        if (! $patient) {
            return redirect()->route('information.index')
                ->with('error', 'Masukan data diri kamu terlebih dahulu sebelum melakukan screening.');
        }

        $screeningData = $this->queryService->getPatientScreeningIndexData(Auth::id());

        return Inertia::render('Dashboard/Patients/Screenings/Offline/Index', [
            'screening' => $screeningData,
        ]);
    }

    public function create()
    {
        $creationData = $this->queryService->getScreeningCreationData(Auth::user());

        return Inertia::render('Dashboard/Patients/Screenings/Offline/ScreeningOffline', $creationData);
    }

    public function store(ScreeningOfflineRequest $request)
    {
        try {
            $this->submissionService->handle(Auth::user(), $request->validated());
        } catch (\Exception $e) {
            report($e);

            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan screening. Silakan coba lagi.');
        }

        return redirect(route('screening.index'))->with('success', 'Screening Anda Berhasil Di Simpan');
    }

    public function show($uuid)
    {
        $screening = $this->queryService->getScreeningDetailsByUuid(Auth::id(), $uuid);

        // Kirim data pasien beserta jawaban screening dan pemeriksaan fisik ke tampilan Inertia
        return Inertia::render('Dashboard/Patients/Screenings/Details/ScreeningOfflineDetail', [
            'screening' => $screening,
        ]);
    }

    public function generatePDF($id)
    {
        $screening = Patients::with(['answers.question', 'physicalExaminations'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return $this->pdfService->generateForScreening($screening);
    }
}
