<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Data\QrcodeController;
use App\Http\Controllers\Users\AdminController;
use App\Http\Controllers\Users\DoctorController;
use App\Http\Controllers\Clinic\OfficeController;
use App\Http\Controllers\Users\CashierController;
use App\Http\Controllers\Users\ManagerController;
use App\Http\Controllers\Ai\KtpAnalysisController;
use App\Http\Controllers\Users\PatientsController;
use App\Http\Controllers\Users\ParamedisController;
use App\Http\Controllers\Users\WarehouseController;
use App\Http\Controllers\Screenings\GuestController;
use App\Http\Controllers\Data\PatientsDataController;
use App\Http\Controllers\Payments\PaymentsController;
use App\Http\Controllers\Medicines\MedicineController;
use App\Http\Controllers\Community\CommunityController;
use App\Http\Controllers\Questioner\QuestionerController;
use App\Http\Controllers\Clinic\ManagementStaffController;
use App\Http\Controllers\Report\ParamedisReportController;
use App\Http\Controllers\Clinic\MedicalPersonnelController;
use App\Http\Controllers\Community\CreateAccountController;
use App\Http\Controllers\Payments\PaymentsOnlineController;
use App\Http\Controllers\Appointments\AppointmentController;
use App\Http\Controllers\Community\ProfileAccountController;
use App\Http\Controllers\Clinic\PhysicalExaminationController;
use App\Http\Controllers\Screenings\ScreeningOnlineController;
use App\Http\Controllers\Questioner\QuestionerOnlineController;
use App\Http\Controllers\Screenings\ScreeningOfflineController;
use App\Http\Controllers\Appointments\AppointmentDoctorController;
use App\Http\Controllers\Clinic\MedicalRecordController;
use App\Http\Controllers\Clinic\PhysicalExaminationOnlineController;

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
    Route::get('/', [PatientsController::class, 'index'])->name('dashboard');
    // Profile Edit Page
    Route::get('profile', [PatientsController::class, 'profile'])->name('patients.profile');

    Route::resource('screening', ScreeningOfflineController::class)
        ->only(['index', 'store', 'update', 'create', 'show'])
        ->middleware(['auth', 'role:patients']);

    Route::resource('information', PatientsDataController::class)
        ->only(['index', 'store']);

    Route::resource('appointments', AppointmentController::class)
        ->only(['index', 'store','update']);

    Route::resource('screening-online', ScreeningOnlineController::class)
        ->only(['index','create','store']);

    Route::get('/payment/{screeningId}', [PaymentsOnlineController::class, 'create'])->name('payment.create');
    Route::post('payment/check', [PaymentsOnlineController::class, 'store'])->name('payments.online.store');

    Route::resource('result-screening', QrcodeController::class)
        ->only(['show']);
    


});

// Dashboard Doctor
Route::prefix('dashboard/doctor')->middleware(['auth', 'role:doctor'])->group(function () {
    // Dashboard
    Route::get('/', [DoctorController::class, 'index'])->name('doctor.dashboard');
    // Profile Edit Page
    Route::get('profile', [DoctorController::class, 'profile'])->name('doctor.profile');

    Route::get('appointments',[AppointmentDoctorController::class, 'index'])->name('appointments.doctor');
    Route::get('appointments/emr/{appointment_id}',[AppointmentDoctorController::class, 'show'])->name('appointments.emr');
    Route::post('appointments/start',[AppointmentDoctorController::class, 'store'])->name('appointments.start');

    Route::get('appointments/history', [AppointmentDoctorController::class, 'history'])->name('doctor.history.appointments');
    
    Route::resource('medical-record', MedicalRecordController::class)
    ->only(['index','show']);

    Route::get('screening', [DoctorController::class, 'screening'])->name('doctor.screening');

});

// Paramedis
Route::prefix('dashboard/paramedis')->middleware(['auth', 'role:paramedis'])->group(function () {
    Route::get('/', [ParamedisController::class, 'index'])->name('paramedis.dashboard');

    Route::get('profile', [ParamedisController::class, 'profile'])->name('paramedis.profile');

    Route::get('screening', [ParamedisController::class, 'showScreeningOffline'])->name('paramedis.screening');
    Route::get('screening/detail/{id}', [ParamedisController::class, 'show'])->name('paramedis.detail');


    // History Screening Offline
    Route::get('history', [ParamedisController::class, 'showHistoryScreening'])->name('paramedis.history');



    Route::get('screening-online', [ParamedisController::class, 'showScreeningOnline'])->name('screening-online.paramedis');
    
    Route::resource('physicalexamination-online', PhysicalExaminationOnlineController::class)
        ->only(['store']);

    Route::resource('report', ParamedisReportController::class)
        ->only(['index']);

});

// cashier
Route::prefix('dashboard/cashier')->middleware(['auth', 'role:cashier'])->group(function () {
    // Dashboard
    Route::get('/', [CashierController::class, 'index'])->name('cashier.dashboard');
    // Profile Edit
    Route::get('profile', [CashierController::class, 'profile'])->name('cashier.profile');

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

    Route::get('history', [CashierController::class, 'historyPaymentsOffline'])->name('history.cashier');

    Route::get('screening-online', [CashierController::class, 'showScreeningOnline'])->name('cashier.screening-online');
    Route::get('screening-online/payments/{id}', [CashierController::class, 'showPayment'])->name('cashier.payments-online');


    Route::post('/payments/{id}/confirm', [PaymentsOnlineController::class, 'confirmPayment'])
    ->name('payments.confirm');
});

// Admin
Route::prefix('dashboard/admin')->middleware(['auth', 'role:admin'])->group(function () {
    // Dashboard Admin
    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
    /**
     * Rute untuk obat (list obat, edit obat,hapus, menambahkan obat)
     */

    /**
     * Rute untuk menambahkan tenaga medis dan list tenaga medis
     */
    Route::resource('users', MedicalPersonnelController::class)
        ->only(['index', 'store', 'update', 'create'])
        ->middleware(['auth']);

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
});
// manager
Route::prefix('dashboard/manager')->middleware(['auth', 'role:manager'])->group(function () {
    // Dashboard
    Route::get('/', [ManagerController::class, 'index'])->name('manager.dashboard');

    // Profile edit
    Route::get('profile', [ManagerController::class, 'profile'])->name('manager.profile');

    Route::get('screening', [ManagerController::class, 'screening'])->name('manager.screening');

});

Route::prefix('dashboard/warehouse')->middleware(['auth', 'role:warehouse'])->group(function () {
    // Dashboard
    Route::get('/', [WarehouseController::class, 'index'])->name('warehouse.dashboard');
});


Route::middleware(['auth'])->group(function () {

    Route::resource('physicalexamination', PhysicalExaminationController::class)
    ->only(['store']);

    // Rute untuk pembuatan akun komunitas
    Route::resource('community/create-account', CreateAccountController::class)
        ->only(['index', 'store']);

    Route::resource('community/profile', ProfileAccountController::class)
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



require __DIR__.'/auth.php';
