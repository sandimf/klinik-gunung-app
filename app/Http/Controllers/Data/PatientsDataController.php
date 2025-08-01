<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use App\Http\Requests\Information\PatientsInformationRequest;
use App\Services\Data\PatientDataCreationService;
use App\Services\Data\PatientDataQueryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PatientsDataController extends Controller
{
    public function __construct(
        protected PatientDataQueryService $queryService,
        protected PatientDataCreationService $creationService
    ) {}

    public function index(): InertiaResponse
    {
        $viewData = $this->queryService->getDataForIndex(Auth::user());

        return Inertia::render('Dashboard/Patients/DataPatients/Index', $viewData);
    }

    public function store(PatientsInformationRequest $request): RedirectResponse
    {
        try {
            $this->creationService->createPatientData(
                Auth::user(),
                $request->validated(),
                $request->hasFile('ktp_images') ? $request->file('ktp_images') : null
            );
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menyimpan profil pasien. Silakan coba lagi.');
        }

        return redirect()
            ->route('screening.create')
            ->with('success', 'Data kamu berhasil disimpan');
    }
}
