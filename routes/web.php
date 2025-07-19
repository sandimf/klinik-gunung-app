<?php

use App\Http\Controllers\Auth\ProviderController;
use App\Http\Controllers\Screening\GuestScreeningController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::fallback(function () {
    return Inertia::render('Errors/Error', ['status' => 404]);

    return Inertia::render('Errors/Error', ['status' => 403]);

    return Inertia::render('Errors/Error', ['status' => 401]);

    return Inertia::render('Errors/Error', ['status' => 400]);

    return Inertia::render('Errors/Error', ['status' => 405]);

    return Inertia::render('Errors/Error', ['status' => 500]);

    return Inertia::render('Errors/Error', ['status' => 501]);

    return Inertia::render('Errors/Error', ['status' => 502]);

    return Inertia::render('Errors/Error', ['status' => 503]);
});
// ===================================================================
// AUTHENTICATED ROUTES
// ===================================================================

Route::middleware(['auth'])->group(function () {

    // ===================================================================
    // SHARED ROUTES
    // ===================================================================
    require __DIR__.'/shared.php';

    // ===================================================================
    // DOMAIN-SPECIFIC ROUTES
    // ===================================================================

    // Patient routes
    require __DIR__.'/patient.php';

    // Medical routes (Doctor & Paramedic)
    require __DIR__.'/medical.php';

    // Finance routes (Cashier)
    require __DIR__.'/finance.php';

    // Inventory routes (Cashier & Warehouse)
    require __DIR__.'/inventory.php';

    // Admin routes
    require __DIR__.'/admin.php';

    // Manager routes
    require __DIR__.'/manager.php';

    // Community routes
    require __DIR__.'/community.php';
});

// ===================================================================
// AUTH ROUTES
// ===================================================================

require __DIR__.'/auth.php';
