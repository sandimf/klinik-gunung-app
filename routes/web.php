<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AI\ApikeyController;
use App\Http\Controllers\Data\QrcodeController;
use App\Http\Controllers\Users\AdminController;
use App\Http\Controllers\Users\DoctorController;
use App\Http\Controllers\Auth\ProviderController;
use App\Http\Controllers\Clinic\OfficeController;
use App\Http\Controllers\Users\CashierController;
use App\Http\Controllers\Users\ManagerController;
use App\Http\Controllers\Users\ParamedisController;
use App\Http\Controllers\Users\WarehouseController;
use App\Http\Controllers\Screenings\GuestController;
use App\Http\Controllers\Consultation\BodyController;
use App\Http\Controllers\Data\PatientsDataController;
use App\Http\Controllers\Payments\PaymentsController;
use App\Http\Controllers\Medicines\MedicineController;
use App\Http\Controllers\Community\CommunityController;
use App\Http\Controllers\Clinic\MedicalRecordController;
use App\Http\Controllers\Dashboard\AdminPanelController;
use App\Http\Controllers\Report\CashierReportController;
use App\Http\Controllers\Report\ManagerReportController;
use App\Http\Controllers\Backup\DatabaseBackupController;
use App\Http\Controllers\Questioner\QuestionerController;
use App\Http\Controllers\Clinic\ManagementStaffController;
use App\Http\Controllers\Dashboard\ManagerPanelController;
use App\Http\Controllers\Report\ParamedisReportController;
use App\Http\Controllers\Clinic\MedicalPersonnelController;
use App\Http\Controllers\Community\CreateAccountController;
use App\Http\Controllers\Dashboard\PatientsPanelController;
use App\Http\Controllers\Payments\PaymentsOnlineController;
use App\Http\Controllers\Appointments\AppointmentController;
use App\Http\Controllers\Community\ProfileAccountController;
use App\Http\Controllers\Consultation\ConsultationController;
use App\Http\Controllers\Clinic\PhysicalExaminationController;
use App\Http\Controllers\Emergency\EmergencyContactController;
use App\Http\Controllers\Screenings\ScreeningOnlineController;
use App\Http\Controllers\Questioner\QuestionerOnlineController;
use App\Http\Controllers\Screenings\ScreeningOfflineController;
use App\Http\Controllers\Appointments\AppointmentDoctorController;
use App\Http\Controllers\Clinic\PhysicalExaminationOnlineController;
use App\Http\Controllers\Pdf\CustomPdfController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Transaction\PurchaseController;
use App\Models\Users\Paramedis;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Guest Screening Offline
Route::resource('screening-now', GuestController::class)
    ->only(['index', 'store']);

// Dashboard Patients
Route::prefix('dashboard')->middleware(['auth', 'role:patients'])->group(function () {
    // Dashboard Page
    Route::get('/', [PatientsPanelController::class, 'index'])->name('dashboard');
    // Profile Edit Page
    Route::get('profile', [PatientsPanelController::class, 'profile'])->name('patients.profile');

    Route::resource('screening', ScreeningOfflineController::class)
        ->only(['index', 'store', 'update', 'create', 'show'])
        ->middleware(['auth', 'role:patients']);

    Route::resource('information', PatientsDataController::class)
        ->only(['index', 'store']);

    Route::resource('appointments', AppointmentController::class)
        ->only(['index', 'store', 'update']);

    Route::resource('screening-online', ScreeningOnlineController::class)
        ->only(['index', 'create', 'store']);

    // Screening Pembayaran Online
    Route::get('/payment/{screeningId}', [PaymentsOnlineController::class, 'create'])->name('payment.create');
    Route::post('payment/check', [PaymentsOnlineController::class, 'store'])->name('payments.online.store');

    Route::get('result-screening/{id}', [QrcodeController::class, 'show'])->name('result-screening.show');

    // Generate/Download Screening Result
    Route::get('generate-pdf/{id}/download', [ScreeningOfflineController::class, 'generatePDF'])->name('generate.screening.pdf');
    Route::get('generate-pdf/{id}/download/screening-online', [ScreeningOnlineController::class, 'generatePDF'])->name('screening-online.pdf');
});

// Dashboard Doctor
Route::prefix('dashboard/doctor')->middleware(['auth', 'role:doctor'])->group(function () {
    // Dashboard
    Route::get('/', [DoctorController::class, 'index'])->name('doctor.dashboard');
    // Profile Edit Page
    Route::get('profile', [DoctorController::class, 'profile'])->name('doctor.profile');

    // Daftar Appointments
    Route::get('appointments', [AppointmentDoctorController::class, 'index'])->name('appointments.doctor');
    Route::get('appointments/emr/{appointment_id}', [AppointmentDoctorController::class, 'show'])->name('appointments.emr');
    Route::post('appointments/start', [AppointmentDoctorController::class, 'store'])->name('appointments.start');

    Route::get('appointments/history', [AppointmentDoctorController::class, 'history'])->name('doctor.history.appointments');

    Route::resource('medical-record', MedicalRecordController::class)
        ->only(['index', 'show']);

    Route::get('screening', [DoctorController::class, 'screening'])->name('doctor.screening');

    Route::get('patients', [DoctorController::class, 'PatientList'])->name('patients.doctor');

    Route::resource('consultasi', ConsultationController::class)
        ->only(['index', 'create']);
});

// Paramedis
Route::prefix('dashboard/paramedis')->middleware(['auth', 'role:paramedis'])->group(function () {
    Route::get('/', [ParamedisController::class, 'index'])->name('paramedis.dashboard');

    Route::get('profile', [ParamedisController::class, 'profile'])->name('paramedis.profile');

    // Menampilkan Screening Offline
    Route::get('screening', [ParamedisController::class, 'showScreeningOffline'])->name('paramedis.screening');
    Route::get('screening/detail/{id}', [ParamedisController::class, 'show'])->name('paramedis.detail');

    // Menampilkan Screening Online
    Route::get('screening-online/detail/{id}', [ParamedisController::class, 'showScreeningOnlineDetail'])->name('paramedis.detail.online');
    Route::get('screening-online', [ParamedisController::class, 'showScreeningOnline'])->name('screening-online.paramedis');

    // Menampilkan Riwayat
    Route::get('history', [ParamedisController::class, 'showHistoryScreening'])->name('paramedis.history');

    Route::resource('physicalexamination-online', PhysicalExaminationOnlineController::class)
        ->only(['store']);

    Route::get('edit/{id}', [PhysicalExaminationController::class, 'editScreening'])->name('edit.screening');

    Route::resource('report', ParamedisReportController::class)
        ->only(['index']);

    Route::get('activity', [ParamedisReportController::class, 'activity'])->name('activity.healthcheck');
    Route::get('activity/pdf', [ParamedisReportController::class, 'generatePDFActivity'])->name('pdf.activity.paramedis');
    Route::get('activity/pdf-self', [ParamedisReportController::class, 'generatePDFself'])->name('pdf.self.paramedis');
    Route::get('report/health-check/{uuid}', [ParamedisReportController::class, 'generatePDFHealthCheck'])->name('pdf.healthcheck.paramedis');

    Route::put('quesioner/update/{id}', [ParamedisController::class, 'update'])->name('quesioner.update');
});

// cashier
Route::prefix('dashboard/cashier')->middleware(['auth', 'role:cashier'])->group(function () {
    // Dashboard
    Route::get('/', [CashierController::class, 'index'])->name('cashier.dashboard');
    // Profile Edit
    Route::get('profile', [CashierController::class, 'profile'])->name('cashier.profile');

    // Daftar screening untuk pembayaran
    Route::get('screening', [CashierController::class, 'showScreeningOffline'])->name('cashier.screening');

    // Pembayaran Screening
    Route::resource('payments', PaymentsController::class)
        ->only(['store'])
        ->middleware(['auth']);

    Route::resource('medicine', MedicineController::class)
        ->only(['index', 'store', 'update']);

    // Office
    Route::resource('office', OfficeController::class)
        ->only(['index'])
        ->middleware(['auth']);

    Route::get('office/pdf', [OfficeController::class, 'generatePdf'])->name('cashier.pdf.office');

    Route::get('history', [CashierController::class, 'historyPaymentsOffline'])->name('history.cashier');
    Route::get('history-online', [CashierController::class, 'historyPaymentsOnline'])->name('history-online.cashier');
    Route::get('screening-online', [CashierController::class, 'showScreeningOnline'])->name('cashier.screening-online');

    Route::get('screening-online/payments/{id}', [CashierController::class, 'showPayment'])->name('cashier.payments-online');

    Route::post('/payments/{id}/confirm', [PaymentsOnlineController::class, 'confirmPayment'])
        ->name('payments.confirm');

    Route::get('payments/nota/{paymentId', [PaymentsController::class, 'generateNota'])->name('generate.nota');

    Route::get('activity', [CashierReportController::class, 'activity'])->name('cashier.activity');

    Route::get('apotek/import', [MedicineController::class, 'create'])->name('import.apotek');

    Route::post('apotek/import/csv', [MedicineController::class, 'importCombined'])->name('import.combined');

    // Route Menambahkan Product
    Route::get('product', [ProductController::class, 'index'])->name('product.cashier');
    Route::post('product/store', [ProductController::class, 'store'])->name('product.store.cashier');

    Route::get('nota/{noTransaction}', [PaymentsController::class, 'generateNota'])->name('generate.nota.ts');

    // Route Pembelian Cashier
    Route::get('transaction/purchase', [PurchaseController::class, 'index'])->name('cashier.transcation');

    // Route checkout
    Route::post('transaction/purchase/store', [PurchaseController::class, 'store'])->name('product.checkout');
    Route::get('transaction/history', [PurchaseController::class, 'history'])->name('product.history.checkout');
});

// Admin
Route::prefix('dashboard/admin')->middleware(['auth', 'role:admin'])->group(function () {
    // Dashboard Admin
    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');

    Route::resource('users', MedicalPersonnelController::class)
        ->only(['index', 'store', 'update', 'create']);

    Route::resource('settings/emergency', EmergencyContactController::class)
        ->only(['index', 'update', 'store']);

    /**
     * Rute untuk membuat custom questioner untuk screening
     */
    Route::resource('questioner', QuestionerController::class)
        ->only(['index', 'store', 'update', 'create', 'show'])
        ->middleware(['auth']);

    Route::resource('questioner-online', QuestionerOnlineController::class)
        ->only(['index', 'store', 'update', 'create', 'show'])
        ->middleware(['auth']);

    Route::resource('manajement-staff', ManagementStaffController::class)
        ->only(['index'])
        ->middleware(['auth']);

    Route::post('scanning', [QrcodeController::class, 'decrypt'])->name('decrypt.scan');

    Route::get('scan', [AdminController::class, 'scanner'])->name('admin.scan');

    // Profile Edit
    Route::get('profile', [AdminController::class, 'profile'])->name('admin.profile');

    Route::get('bakcup/database', [DatabaseBackupController::class, 'index'])->name('database.backup');

    // social media settings
    Route::get('auth', [AdminPanelController::class, 'AuthSetting'])->name('login.settings');

    // Apikey Settings
    Route::resource('apikey', ApikeyController::class)
        ->only(['index', 'update']);

    Route::put('auth/social/update', [AdminPanelController::class, 'updateAuth'])->name('auth.social.update');

    Route::get('pdf', [CustomPdfController::class, 'index'])->name('custom.pdf');
});
// manager
Route::prefix('dashboard/manager')->middleware(['auth', 'role:manager'])->group(function () {
    // Dashboard
    Route::get('/', [ManagerController::class, 'index'])->name('manager.dashboard');

    // Profile edit
    Route::get('profile', [ManagerController::class, 'profile'])->name('manager.profile');

    Route::get('screening-acitivity', [ManagerReportController::class, 'index'])->name('manager.screening');

    Route::get('staff', [ManagerPanelController::class, 'staff'])->name('manager.staff');

    Route::get('report', [ManagerController::class, 'report'])->name('manager.report');

    Route::get('Apotek', [ManagerPanelController::class, 'Apotek'])->name('manager.apotek');

    Route::get('Office', [ManagerPanelController::class, 'office'])->name('manager.office');

    Route::get('office/pdf', [ManagerReportController::class, 'generatePdf'])->name('manager.office.pdf');

    Route::get('transaction', [ManagerPanelController::class, 'transaction'])->name('manager.transaction');

    Route::get('activity/pdf', [ParamedisReportController::class, 'generatePDFActivity'])->name('pdf.activity.manager');

    Route::get('report/health-check/{uuid}', [ParamedisReportController::class, 'generatePDFHealthCheck'])->name('pdf.healthcheck.manager');
});

// Dashboard Gudang/Warehouse
Route::prefix('dashboard/warehouse')->middleware(['auth', 'role:warehouse'])->group(function () {
    // Dashboard
    Route::get('/', [WarehouseController::class, 'index'])->name('warehouse.dashboard');

    Route::get('profile', [WarehouseController::class, 'profile'])->name('warehouse.profile');

    Route::get('medicine', [WarehouseController::class, 'medicine'])->name('medicine.warehouse');
    Route::post('medicine/store', [MedicineController::class, 'store'])->name('medicine.warehouse.store');
});

Route::middleware(['auth'])->group(function () {
    Route::resource('physicalexamination', PhysicalExaminationController::class)
        ->only(['store']);

    // Rute untuk pembuatan akun komunitas
    Route::resource('community/create-account', CreateAccountController::class)
        ->only(['index', 'store']);

    Route::resource('community/accounts', ProfileAccountController::class)
        ->only(['index', 'store', 'update']);

    // Rute yang membutuhkan username di komunitas
    Route::middleware(['check.username'])->group(function () {
        Route::resource('community', CommunityController::class)
            ->only(['index']);

        Route::get('community/new-post', [CommunityController::class, 'create'])->name('community.create');

        Route::get('/community/{slug}', [CreateAccountController::class, 'profile'])
            ->name('profile.show');
    });

    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

// Login dengan social lite
Route::get('auth/{provider}/redirect', [ProviderController::class, 'redirect']);
Route::get('auth/{provider}/callback', [ProviderController::class, 'callback']);

Route::post('/body', [BodyController::class, 'store'])->name('body.store');
Route::get('/body/show', [BodyController::class, 'show'])->name('body.show');

require __DIR__ . '/auth.php';
