<?php

use App\Http\Controllers\Users\AdminController;
use App\Http\Controllers\Users\CashierController;
use App\Http\Controllers\Clinic\MedicalPersonnelController;
use App\Http\Controllers\Clinic\PhysicalExaminationController;
use App\Http\Controllers\Users\DoctorController;
use App\Http\Controllers\Users\ManagerController;
use App\Http\Controllers\Medicines\MedicineController;
use App\Http\Controllers\Users\ParamedisController;
use App\Http\Controllers\Users\PatientsController;
use App\Http\Controllers\Payments\PaymentsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Questioner\QuestionerController;
use App\Http\Controllers\Screenings\GuestController;
use App\Http\Controllers\Screenings\ScreeningOfflineController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Guest Screening Offline
Route::resource('screening-now', GuestController::class)
    ->only(['index', 'store']);

// Patients
Route::prefix('dashboard')->middleware(['auth', 'role:patients'])->group(function () {
    // Dashboard Page
    Route::get('/', [PatientsController::class, 'index'])->name('dashboard');
    // Profile Edit Page
    Route::get('profile', [PatientsController::class, 'profile'])->name('patients.profile');

    Route::resource('screening', ScreeningOfflineController::class)
        ->only(['index', 'store', 'update', 'create', 'show'])
        ->middleware(['auth', 'role:patients']);
});

// Doctor
Route::prefix('dashboard/doctor')->middleware(['auth', 'role:doctor'])->group(function () {
    // Dashboard
    Route::get('/', [DoctorController::class, 'index'])->name('doctor.dashboard');
    // Profile Edit Page
    Route::get('profile', [DoctorController::class, 'profile'])->name('doctor.profile');
});

// Paramedis
Route::prefix('dashboard/paramedis')->middleware(['auth', 'role:paramedis'])->group(function () {
    Route::get('/', [ParamedisController::class, 'index'])->name('paramedis.dashboard');

    Route::get('profile', [ParamedisController::class, 'profile'])->name('paramedis.profile');

    Route::get('screening', [ParamedisController::class, 'showScreeningOffline'])->name('paramedis.screening');

    Route::resource('physicalexamination', PhysicalExaminationController::class)
        ->only(['store'])
        ->middleware(['auth']);
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
});

// Admin
Route::prefix('dashboard/admin')->middleware(['auth', 'role:admin'])->group(function () {

    // Dashboard Admin
    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');

    /**
     * Rute untuk obat (list obat, edit obat,hapus, menambahkan obat)
     */
    Route::resource('medicine', MedicineController::class)
        ->only(['index', 'store', 'update'])
        ->middleware(['auth', 'role:admin']);

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

    // Profile Edit
    Route::get('profile', [AdminController::class, 'profile'])->name('admin.profile');
});
// manager
Route::prefix('dashboard/manager')->middleware(['auth', 'role:manager'])->group(function () {
    // Dashboard
    Route::get('/', [ManagerController::class, 'index'])->name('manager.dashboard');

    // Profile edit
    Route::get('profile', [ManagerController::class, 'profile'])->name('manager.profile');
});



require __DIR__.'/auth.php';
