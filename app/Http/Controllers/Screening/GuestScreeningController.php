<?php

namespace App\Http\Controllers\Screening;

use App\Exceptions\NikAlreadyExistsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\GuestScreeningRequest;
use App\Mail\AccountCreated;
use App\Models\Ai\Apikey;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\Screenings\ScreeningQuestions;
use App\Models\User;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use App\Services\Screening\GuestScreeningQueryService;
use App\Services\Screening\GuestScreeningSubmissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class GuestScreeningController extends Controller
{
    public function __construct(
        protected GuestScreeningQueryService $queryService,
        protected GuestScreeningSubmissionService $submissionService
    ) {
    }

    public function index(): InertiaResponse
    {
        $viewData = $this->queryService->getScreeningPageData();

        return Inertia::render('Dashboard/Guest/ScreeningOffline', $viewData);
    }

    public function store(GuestScreeningRequest $request): RedirectResponse
    {
        try {
            $this->submissionService->handle(
                $request->validated(),
                $request->hasFile('ktp_images') ? $request->file('ktp_images') : null
            );
        } catch (NikAlreadyExistsException $e) {
            return back()->withErrors(['nik' => $e->getMessage()])->withInput();
        } catch (\Throwable $e) {
            Log::error('Gagal saat screening tamu: ' . $e->getMessage(), ['exception' => $e]);

            return back()->with('error', 'Terjadi kesalahan sistem. Silakan coba lagi nanti.');
        }

        // Kembalikan respons sukses
        return back()->with('success', 'Data pasien dan screening berhasil disimpan.');
    }
}
