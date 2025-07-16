<?php

use App\Http\Controllers\Appointments\AppointmentDoctorController;
use App\Http\Controllers\Chatbot\ChatbotController;
use App\Http\Controllers\Clinic\MedicalRecordController;
use App\Http\Controllers\Clinic\PhysicalExaminationOnlineController;
use App\Http\Controllers\Paramedis\ScreeningAiSuggestionController;
use App\Http\Controllers\Paramedis\v2\HistoryHealthCheckController;
use App\Http\Controllers\Paramedis\v2\MedicalServiceController;
use App\Http\Controllers\Report\ParamedisReportController;
use App\Http\Controllers\Roles\Doctor\DoctorDashboardController;
use App\Http\Controllers\Roles\Doctor\Managements\PatientsListController;
use App\Http\Controllers\Roles\Doctor\Profile\DoctorProfileController;
use App\Http\Controllers\Roles\Doctor\Screenings\DoctorScreeningController;
use App\Http\Controllers\Roles\Doctor\Service\ConsultationController;
use App\Http\Controllers\Roles\Paramedis\HealthCheck\HealthCheckController;
use App\Http\Controllers\Roles\Paramedis\MedicalRecord\ParamedisMedicalRecordController;
use App\Http\Controllers\Roles\Paramedis\ParamedisDasboardController;
use App\Http\Controllers\Roles\Paramedis\PhysicalExaminations\PhysicalExaminationController;
use App\Http\Controllers\Users\ParamedisController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Medical Routes
|--------------------------------------------------------------------------
|
| Routes for medical services including doctor and paramedic functionality
|
*/

// ===================================================================
// DOCTOR DASHBOARD ROUTES
// ===================================================================

Route::prefix('dashboard/doctor')->middleware(['role:doctor'])->group(function () {
    // Dashboard
    Route::get('/', [DoctorDashboardController::class, 'index'])->name('doctor.dashboard');

    // Profile
    Route::get('chatbot', [ChatbotController::class, 'doctor'])->name('chatbot.doctor');
    Route::get('profile', [DoctorProfileController::class, 'index'])->name('doctor.profile');

    // Core Features
    Route::get('screening', [DoctorScreeningController::class, 'index'])->name('doctor.screening');
    Route::get('screening/{uuid}', [DoctorScreeningController::class, 'show'])->name('doctor.screening.show');
    Route::get('patients', [PatientsListController::class, 'index'])->name('patients.doctor');
    Route::get('patients/{uuid}', [PatientsListController::class, 'show'])->name('patients.doctor.show');

    // Appointment Management
    Route::get('appointments', [AppointmentDoctorController::class, 'index'])->name('appointments.doctor');
    Route::get('appointments/emr/{appointment_id}', [AppointmentDoctorController::class, 'show'])->name('appointments.emr');
    Route::post('appointments/start', [AppointmentDoctorController::class, 'store'])->name('appointments.start');
    Route::get('appointments/history', [AppointmentDoctorController::class, 'history'])->name('doctor.history.appointments');

    // Medical Records
    Route::resource('medical-record', MedicalRecordController::class)
        ->only(['index', 'show']);

    // Consultations
    Route::get('consultation', [ConsultationController::class, 'index'])->name('consultation.index');
    Route::get('consultation/{uuid}', [ConsultationController::class, 'show'])->name('consultation.show');
});

// ===================================================================
// PARAMEDIS DASHBOARD ROUTES
// ===================================================================

Route::prefix('dashboard/paramedis')->middleware(['role:paramedis'])->group(function () {
    // Dashboard & Profile
    Route::get('/', [ParamedisController::class, 'index'])->name('paramedis.dashboard');
    Route::get('profile', [ParamedisController::class, 'profile'])->name('paramedis.profile');
    Route::get('screenings', [ParamedisDasboardController::class, 'index'])->name('paramedis.screenings');
    Route::get('chatbot', [ChatbotController::class, 'paramedis'])->name('chatbot.paramedis');

    // Medical Records
    Route::get('medical-record', [ParamedisMedicalRecordController::class, 'index'])->name('medical-record.paramedis');
    Route::get('medical-record/{uuid}', [ParamedisMedicalRecordController::class, 'show'])->name('show.medical-record.paramedis');

    // Screening Management
    Route::get('screening/detail/{uuid}', [HealthCheckController::class, 'show'])->name('paramedis.detail');
    Route::get('screening/history/detail/{uuid}', [HistoryHealthCheckController::class, 'show'])->name('history.healthcheck');
    Route::get('edit/{uuid}', [PhysicalExaminationController::class, 'editScreening'])->name('edit.screening');
    Route::put('edit/{uuid}', [PhysicalExaminationController::class, 'update'])->name('update.examinations');
    Route::put('quesioner/update/{id}', [ParamedisController::class, 'update'])->name('quesioner.update');

    // Online Screening
    Route::get('screening-online/detail/{id}', [ParamedisController::class, 'showScreeningOnlineDetail'])->name('paramedis.screenings.online.detail');
    Route::get('screening-online', [ParamedisController::class, 'showScreeningOnline'])->name('screening-online.paramedis');

    // Physical Examination
    Route::resource('physicalexamination-online', PhysicalExaminationOnlineController::class)
        ->only(['store']);

    // Medical Services
    Route::resource('services', MedicalServiceController::class)
        ->only(['index', 'store', 'show', 'update']);

    Route::resource('report', ParamedisReportController::class)
        ->only(['index']);
    // History & Reports
    Route::get('history', [HistoryHealthCheckController::class, 'index'])->name('paramedis.history');
    Route::get('activity', [ParamedisReportController::class, 'activity'])->name('activity.healthcheck');

    // PDF Generation
    Route::get('activity/pdf', [ParamedisReportController::class, 'generatePDFActivity'])->name('pdf.activity.paramedis');
    Route::get('activity/pdf/generate', [ParamedisReportController::class, 'generatePDFself'])->name('pdf.self.paramedis');
    Route::get('report/health-check/{uuid}', [ParamedisReportController::class, 'generatePDFHealthCheck'])->name('pdf.healthcheck.paramedis');

    // AI Suggestion
    // AI Suggestion untuk paramedis
    Route::post('screening/ai-suggestion-paramedis', [ScreeningAiSuggestionController::class, 'suggestParamedis'])->name('screening.ai.suggestion.paramedis');
});

// ===================================================================
// SHARED MEDICAL ROUTES
// ===================================================================

Route::middleware(['auth'])->group(function () {
    Route::resource('physicalexamination', PhysicalExaminationController::class)
        ->only(['store', 'update']);
});
