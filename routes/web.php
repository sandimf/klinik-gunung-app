<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ProviderController;
use App\Http\Controllers\Screening\GuestScreeningController;

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
    // SHARED ROUTES
    // ===================================================================
    require __DIR__ . '/shared.php';

    // ===================================================================
    // DOMAIN-SPECIFIC ROUTES
    // ===================================================================
    
    // Patient routes
    require __DIR__ . '/patient.php';
    
    // Medical routes (Doctor & Paramedic)
    require __DIR__ . '/medical.php';
    
    // Finance routes (Cashier)
    require __DIR__ . '/finance.php';
    
    // Inventory routes (Cashier & Warehouse)
    require __DIR__ . '/inventory.php';
    
    // Admin routes
    require __DIR__ . '/admin.php';
    
    // Manager routes
    require __DIR__ . '/manager.php';
    
    // Community routes
    require __DIR__ . '/community.php';
});

// ===================================================================
// AUTH ROUTES
// ===================================================================

require __DIR__ . '/auth.php';
