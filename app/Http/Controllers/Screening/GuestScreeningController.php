<?php

namespace App\Http\Controllers\Screening;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuestScreeningRequest;
use App\Services\Screening\GuestScreeningQueryService;
use App\Services\Screening\GuestScreeningSubmissionService;
use App\Traits\HasFlashMessages;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

use Inertia\Response as InertiaResponse;

class GuestScreeningController extends Controller
{
  use HasFlashMessages;

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
    } catch (\Throwable $e) {

      return $this->flashError('Terjadi kesalahan sistem. Silakan coba lagi nanti.');
    }

    return redirect(route('screening-now.index'))->with('success', 'Data pasien dan screening berhasil disimpan.');
  }
}
