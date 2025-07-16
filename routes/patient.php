<?php

use App\Http\Controllers\Appointments\AppointmentController;
use App\Http\Controllers\Dashboard\PatientsPanelController;
use App\Http\Controllers\Data\PatientsDataController;
use App\Http\Controllers\Data\QrcodeController;
use App\Http\Controllers\Payments\PaymentsOnlineController;
use App\Http\Controllers\Screening\InClinicScreeningController;
use App\Http\Controllers\Screening\RemoteScreeningController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Patient Routes
|--------------------------------------------------------------------------
|
| Routes for patient dashboard and patient-specific functionality
|
*/

Route::prefix('dashboard')->middleware(['role:patients'])->group(function () {
    // Dashboard & Profile
    Route::get('/', [PatientsPanelController::class, 'index'])->name('dashboard');
    Route::get('profile', [PatientsPanelController::class, 'profile'])->name('patients.profile');

    // Patient Information Management
    Route::resource('information', PatientsDataController::class)
        ->only(['index', 'store']);

    // Screening Management
    Route::resource('screening', InClinicScreeningController::class)
        ->only(['index', 'store', 'update', 'create', 'show'])
        ->middleware(['auth', 'role:patients']);

    Route::resource('screening-online', RemoteScreeningController::class)
        ->only(['index', 'create', 'store']);

    // Appointment Management
    Route::resource('appointments', AppointmentController::class)
        ->only(['index', 'store', 'update']);

    // Payment Management
    Route::get('/payment/{screeningId}', [PaymentsOnlineController::class, 'create'])->name('payment.create');
    Route::post('payment/check', [PaymentsOnlineController::class, 'store'])->name('payments.online.store');

    // Results & Reports
    Route::get('result-screening/{id}', [QrcodeController::class, 'show'])->name('result-screening.show');
    Route::get('generate-pdf/{id}/download', [InClinicScreeningController::class, 'generatePDF'])->name('generate.screening.pdf');
    Route::get('generate-pdf/{id}/download/screening-online', [RemoteScreeningController::class, 'generatePDF'])->name('screening-online.pdf');
});
