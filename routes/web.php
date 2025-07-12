<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Data\QrcodeController;
use App\Http\Controllers\Auth\ProviderController;
use App\Http\Controllers\Clinic\OfficeController;
use App\Http\Controllers\Pdf\CustomPdfController;
use App\Http\Controllers\Users\CashierController;
use App\Http\Controllers\Users\ManagerController;
use App\Http\Controllers\Chatbot\ChatbotController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Users\ParamedisController;
use App\Http\Controllers\Users\WarehouseController;
use App\Http\Controllers\Data\PatientsDataController;
use App\Http\Controllers\Payments\PaymentsController;
use App\Http\Controllers\Medicines\MedicineController;
use App\Http\Controllers\Community\CommunityController;
use App\Http\Controllers\Cashier\v2\CompanionController;
use App\Http\Controllers\Clinic\MedicalRecordController;
use App\Http\Controllers\Report\CashierReportController;
use App\Http\Controllers\Report\ManagerReportController;
use App\Http\Controllers\Transaction\PurchaseController;
use App\Http\Controllers\Admin\v2\LoginSettingController;
use App\Http\Controllers\Dashboard\ManagerPanelController;
use App\Http\Controllers\Report\ParamedisReportController;
use App\Http\Controllers\Community\CreateAccountController;
use App\Http\Controllers\Dashboard\PatientsPanelController;
use App\Http\Controllers\Payments\PaymentsOnlineController;
use App\Http\Controllers\Appointments\AppointmentController;
use App\Http\Controllers\Community\ProfileAccountController;
use App\Http\Controllers\Paramedis\v2\HealthCheckController;
use App\Http\Controllers\Roles\Admin\Scanner\ScanController;
use App\Http\Controllers\Screening\GuestScreeningController;
use App\Http\Controllers\Screening\RemoteScreeningController;
use App\Http\Controllers\Cashier\v2\ActivityCashierController;
use App\Http\Controllers\Paramedis\v2\MedicalServiceController;
use App\Http\Controllers\Screening\InClinicScreeningController;
use App\Http\Controllers\Roles\Admin\Management\StaffController;
use App\Http\Controllers\Roles\Doctor\DoctorDashboardController;
use App\Http\Controllers\Appointments\AppointmentDoctorController;
use App\Http\Controllers\Roles\Cashier\CashierDashboardController;
use App\Http\Controllers\Paramedis\v2\HistoryHealthCheckController;
use App\Http\Controllers\Roles\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Clinic\PhysicalExaminationOnlineController;
use App\Http\Controllers\Roles\Doctor\Service\ConsultationController;
use App\Http\Controllers\Roles\Doctor\Profile\DoctorProfileController;
use App\Http\Controllers\Roles\Cashier\Profile\ProfileCashierController;
use App\Http\Controllers\Admin\v2\ApikeyController as v2ApikeyController;
use App\Http\Controllers\Roles\Doctor\Managements\PatientsListController;
use App\Http\Controllers\Roles\Admin\Management\AmountScreeningController;
use App\Http\Controllers\Roles\Admin\Management\EmergencyContactController;
use App\Http\Controllers\Roles\Doctor\Screenings\DoctorScreeningController;
use App\Http\Controllers\Admin\v2\Questioner\QuestionerForScreeningController;
use App\Http\Controllers\Admin\v2\AdminPanelController as V2AdminPanelController;
use App\Http\Controllers\Admin\v2\Questioner\QuestionerForScreeningOnlineController;
use App\Http\Controllers\Roles\Cashier\MedicalRecord\CashierMedicalRecordController;
use App\Http\Controllers\Roles\Paramedis\MedicalRecord\ParamedisMedicalRecordController;
use App\Http\Controllers\Roles\Paramedis\PhysicalExaminations\PhysicalExaminationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// ===================================================================
// PUBLIC ROUTES
// ===================================================================

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Guest Screening Routes
Route::resource('screening-now', GuestScreeningController::class)
    ->only(['index', 'store']);

// Social Authentication Routes
Route::get('auth/{provider}/redirect', [ProviderController::class, 'redirect']);
Route::get('auth/{provider}/callback', [ProviderController::class, 'callback']);

// ===================================================================
// AUTHENTICATED ROUTES
// ===================================================================

Route::middleware(['auth'])->group(function () {

    // ===================================================================
    // SHARED AUTHENTICATED ROUTES
    // ===================================================================
    Route::post('chatbot', [ChatbotController::class, 'post'])->name('chatbot.post');

    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::resource('physicalexamination', PhysicalExaminationController::class)
        ->only(['store', 'update']);

    // ===================================================================
    // PATIENT DASHBOARD ROUTES
    // ===================================================================

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
        Route::get('screenings', [ParamedisController::class, 'showScreenings'])->name('paramedis.screenings');
        Route::get('chatbot', [ChatbotController::class, 'paramedis'])->name('chatbot.paramedis');


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

        // History & Reports
        Route::get('history', [HistoryHealthCheckController::class, 'index'])->name('paramedis.history');
        Route::get('activity', [ParamedisReportController::class, 'activity'])->name('activity.healthcheck');

        Route::resource('report', ParamedisReportController::class)
            ->only(['index']);

        // PDF Generation
        Route::get('activity/pdf', [ParamedisReportController::class, 'generatePDFActivity'])->name('pdf.activity.paramedis');
        Route::get('activity/pdf/generate', [ParamedisReportController::class, 'generatePDFself'])->name('pdf.self.paramedis');
        Route::get('report/health-check/{uuid}', [ParamedisReportController::class, 'generatePDFHealthCheck'])->name('pdf.healthcheck.paramedis');
    });

    // ===================================================================
    // CASHIER DASHBOARD ROUTES
    // ===================================================================

    Route::prefix('dashboard/cashier')->middleware(['role:cashier'])->group(function () {
        // Dashboard & Profile
        Route::get('/', [CashierDashboardController::class, 'index'])->name('cashier.dashboard');
        Route::get('profile', [ProfileCashierController::class, 'index'])->name('cashier.profile');

        Route::get('chatbot', [ChatbotController::class, 'cashier'])->name('chatbot.cashier');

        // Screening Management
        Route::get('screening', [CashierController::class, 'screenings'])->name('cashier.screening');
        Route::get('screening-online', [CashierController::class, 'showScreeningOnline'])->name('cashier.screening-online');
        Route::get('screening-online/payments/{id}', [CashierController::class, 'showPayment'])->name('cashier.payments-online');
        Route::get('companion', [CompanionController::class, 'index'])->name('companion.screening');
        Route::get('consultation', [CompanionController::class, 'doctor'])->name('cashier.consultation');

        // Payment Processing
        Route::resource('payments', PaymentsController::class)
            ->only(['store'])
            ->middleware(['auth']);

        Route::post('/payments/{id}/confirm', [PaymentsOnlineController::class, 'confirmPayment'])
            ->name('payments.confirm');

        // Payment History
        Route::get('history', [CashierController::class, 'historyPaymentsOffline'])->name('history.cashier');
        Route::get('history-online', [CashierController::class, 'historyPaymentsOnline'])->name('history-online.cashier');

        // Medicine Management
        Route::resource('medicine', MedicineController::class)
            ->only(['index', 'store', 'update']);

        Route::get('apotek/import', [MedicineController::class, 'create'])->name('import.apotek');
        Route::post('apotek/import/csv', [MedicineController::class, 'importCombined'])->name('import.combined');

        // Office Management
        Route::resource('office', OfficeController::class)
            ->only(['index'])
            ->middleware(['auth']);

        Route::get('office/pdf', [OfficeController::class, 'generatePdf'])->name('cashier.pdf.office');

        // Product Management
        Route::get('product', [ProductController::class, 'index'])->name('product.cashier');
        Route::post('product/store', [ProductController::class, 'store'])->name('product.store.cashier');

        // Transaction Management
        Route::get('transaction/purchase', [PurchaseController::class, 'index'])->name('cashier.transcation');
        Route::post('transaction/purchase/store', [PurchaseController::class, 'store'])->name('product.checkout');
        Route::get('transaction/history', [PurchaseController::class, 'history'])->name('product.history.checkout');

        // Receipt Generation
        Route::get('payments/nota/{paymentId}', [PaymentsController::class, 'generateNota'])->name('generate.nota');
        Route::get('nota/{noTransaction}', [PaymentsController::class, 'generateNota'])->name('generate.nota.ts');

        // Activity Reports
        Route::get('activity', [CashierReportController::class, 'activity'])->name('cashier.activity');
        Route::get('activity-cashier', [ActivityCashierController::class, 'index'])->name('acitivity-cashier.index');

        Route::get('report/health-check/{uuid}', [ParamedisReportController::class, 'generatePDFHealthCheck'])->name('pdf.healthcheck.cashier');
        Route::get('medical-record', [CashierMedicalRecordController::class, 'index'])->name('medical-record.cashier');
        Route::get('medical-record/{uuid}', [CashierMedicalRecordController::class, 'show'])->name('show.medical-record.cashier');
    });

    // ===================================================================
    // ADMIN DASHBOARD ROUTES
    // ===================================================================

    Route::prefix('dashboard/master')->middleware(['role:admin'])->group(function () {
        // Dashboard & Profile
        Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');
        Route::get('profile', [V2AdminPanelController::class, 'profile'])->name('admin.profile');

        Route::get('chatbot', [ChatbotController::class, 'index'])->name('chatbot.admin');


        // Staff Management
        Route::resource('staff', StaffController::class)
            ->only(['index', 'store', 'create']);

        Route::patch('staff/{user}/password', [StaffController::class, 'updatePassword'])->name('staff.updatePassword');

        // Route::resource('manajement-staff', ManagementStaffController::class)
        //     ->only(['index'])
        //     ->middleware(['auth']);

        // Questionnaire Management
        Route::resource('questioner', QuestionerForScreeningController::class)
            ->only(['index', 'store', 'update', 'create'])
            ->middleware(['auth']);

        Route::resource('questioner-online', QuestionerForScreeningOnlineController::class)
            ->only(['index', 'store', 'update', 'create'])
            ->middleware(['auth']);

        // Scanner & Security
        Route::get('scan', [ScanController::class, 'index'])->name('admin.scan');
        Route::post('scanning', [ScanController::class, 'decrypt'])->name('decrypt.scan');

        // Settings Management
        Route::resource('auth-settings', LoginSettingController::class)
            ->only(['index', 'update']);

        Route::resource('apikey', v2ApikeyController::class)
            ->only(['index', 'update']);

        Route::resource('emergecy-contact', EmergencyContactController::class)
            ->only(['index', 'update']);

        Route::resource('settings/emergency', EmergencyContactController::class)
            ->only(['index', 'store']);

        // PDF Management
        Route::get('pdf', [CustomPdfController::class, 'index'])->name('custom.pdf');

        Route::resource('amounts', AmountScreeningController::class)->only(['index', 'store', 'update', 'destroy']);
    });

    // ===================================================================
    // MANAGER DASHBOARD ROUTES
    // ===================================================================

    Route::prefix('dashboard/manager')->middleware(['role:manager'])->group(function () {
        // Dashboard & Profile
        Route::get('/', [ManagerController::class, 'index'])->name('manager.dashboard');
        Route::get('profile', [ManagerController::class, 'profile'])->name('manager.profile');

        // Management Overview
        Route::get('staff', [ManagerPanelController::class, 'staff'])->name('manager.staff');
        Route::get('report', [ManagerController::class, 'report'])->name('manager.report');
        Route::get('Apotek', [ManagerPanelController::class, 'Apotek'])->name('manager.apotek');
        Route::get('Office', [ManagerPanelController::class, 'office'])->name('manager.office');
        Route::get('transaction', [ManagerPanelController::class, 'transaction'])->name('manager.transaction');

        // Screening Activities
        Route::get('screening-acitivity', [ManagerReportController::class, 'index'])->name('manager.screening');

        // PDF Reports
        Route::get('office/pdf', [ManagerReportController::class, 'generatePdf'])->name('manager.office.pdf');
        Route::get('activity/pdf', [ParamedisReportController::class, 'generatePDFActivity'])->name('pdf.activity.manager');
        Route::get('report/health-check/{uuid}', [ParamedisReportController::class, 'generatePDFHealthCheck'])->name('pdf.healthcheck.manager');
    });

    // ===================================================================
    // WAREHOUSE DASHBOARD ROUTES
    // ===================================================================

    Route::prefix('dashboard/warehouse')->middleware(['role:warehouse'])->group(function () {
        // Dashboard & Profile
        Route::get('/', [WarehouseController::class, 'index'])->name('warehouse.dashboard');
        Route::get('profile', [WarehouseController::class, 'profile'])->name('warehouse.profile');

        // Medicine Management
        Route::get('medicine', [WarehouseController::class, 'medicine'])->name('medicine.warehouse');
        Route::post('medicine/store', [MedicineController::class, 'store'])->name('medicine.warehouse.store');
    });

    // ===================================================================
    // COMMUNITY FEATURES
    // ===================================================================

    // Community Account Management
    Route::resource('community/create-account', CreateAccountController::class)
        ->only(['index', 'store']);

    Route::resource('community/accounts', ProfileAccountController::class)
        ->only(['index', 'store', 'update']);

    // Community Features (requires username)
    Route::middleware(['check.username'])->group(function () {
        Route::resource('community', CommunityController::class)
            ->only(['index']);

        Route::get('community/new-post', [CommunityController::class, 'create'])->name('community.create');

        Route::get('/community/{slug}', [CreateAccountController::class, 'profile'])
            ->name('profile.show');
    });

    // Route untuk update tinggi & berat badan pasien
    // Di routes/web.php
    Route::put('/patients/{id}/physical', [ParamedisController::class, 'updatePhysicalAttributes'])
        ->name('patients.updatePhysical');

    Route::post('/screening/ai-suggestion', [\App\Http\Controllers\Paramedis\ScreeningAiSuggestionController::class, 'suggest'])->name('screening.ai.suggestion');
});

require __DIR__ . '/auth.php';
