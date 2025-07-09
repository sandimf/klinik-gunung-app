<?php

namespace App\Http\Controllers\Appointments;

use App\Exceptions\SchedulingConflictException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Appointments\StoreAppointmentRequest;
use App\Services\Appointments\AppointmentCancellationService;
use App\Services\Appointments\AppointmentCreationService;
use App\Services\Appointments\AppointmentQueryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AppointmentController extends Controller
{
    public function __construct(
        protected AppointmentQueryService $queryService,
        protected AppointmentCreationService $creationService,
        protected AppointmentCancellationService $cancellationService
    ) {}

    public function index(): InertiaResponse|RedirectResponse
    {
        $user = Auth::user();

        // Logika untuk mendapatkan data janji temu didelegasikan ke service.
        $appointmentsData = $this->queryService->getAppointmentsForUser($user);

        // Service akan mengembalikan null jika data pasien tidak ada.
        if ($appointmentsData === null) {
            return redirect()->route('information.index')
                ->with('message', 'Masukan data diri kamu terlebih dahulu sebelum mengakses janji temu.');
        }

        return Inertia::render('Dashboard/Patients/Appointments/Index', [
            'appointments' => $appointmentsData,
        ]);
    }

    public function store(StoreAppointmentRequest $request): RedirectResponse
    {
        try {
            // Seluruh logika kompleks pembuatan janji temu didelegasikan ke service.
            $this->creationService->create(Auth::user(), $request->validated());
        } catch (SchedulingConflictException $e) {
            // Menangani error spesifik dari aturan bisnis dengan pesan yang jelas ke user.
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Gagal membuat janji temu: '.$e->getMessage(), ['exception' => $e]);

            return redirect()->back()->with('error', 'Terjadi kesalahan. Gagal membuat janji temu.');
        }

        return redirect()->route('appointments.index')
            ->with('success', 'Janji temu berhasil dibuat!');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            // Logika pembatalan didelegasikan ke service, termasuk validasi kepemilikan.
            $this->cancellationService->cancel(Auth::user(), $id);
        } catch (SchedulingConflictException $e) {
            // Menggunakan exception yang sama untuk error aturan bisnis pembatalan.
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Gagal membatalkan janji temu: '.$e->getMessage(), ['appointment_id' => $id, 'exception' => $e]);

            return redirect()->back()->with('error', 'Gagal membatalkan janji temu.');
        }

        return redirect()->route('appointments.index')
            ->with('success', 'Janji Temu Berhasil di Batalkan');
    }
}
