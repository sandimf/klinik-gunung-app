<?php

use App\Http\Controllers\Admin\v2\AdminPanelController as V2AdminPanelController;
// use App\Http\Controllers\Pdf\CustomPdfController;
use App\Http\Controllers\Admin\v2\ApikeyController as v2ApikeyController;
use App\Http\Controllers\Admin\v2\LoginSettingController;
use App\Http\Controllers\Admin\v2\Questioner\QuestionerForScreeningController;
use App\Http\Controllers\Admin\v2\Questioner\QuestionerForScreeningOnlineController;
use App\Http\Controllers\Chatbot\ChatbotController;
use App\Http\Controllers\Roles\Admin\AdminDasboardController;
use App\Http\Controllers\Roles\Admin\Management\AmountScreeningController;
use App\Http\Controllers\Roles\Admin\Management\EmergencyContactController;
use App\Http\Controllers\Roles\Admin\Management\StaffController;
use App\Http\Controllers\Roles\Admin\Scanner\ScanController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Routes for admin dashboard and system management
|
*/

// ===================================================================
// ADMIN DASHBOARD ROUTES
// ===================================================================

Route::prefix('dashboard/master')->middleware(['role:admin'])->group(function () {
    // Dashboard & Profile
    Route::get('/', [AdminDasboardController::class, 'index'])->name('admin.dashboard');
    Route::get('profile', [V2AdminPanelController::class, 'profile'])->name('admin.profile');
    Route::get('chatbot', [ChatbotController::class, 'index'])->name('chatbot.admin');

    // Staff Management
    Route::resource('staff', StaffController::class)
        ->only(['index', 'store', 'create']);

    Route::patch('staff/{user}/password', [StaffController::class, 'updatePassword'])->name('staff.updatePassword');

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
    // Route::get('pdf', [CustomPdfController::class, 'index'])->name('custom.pdf');

    // Amount Settings
    Route::resource('amounts', AmountScreeningController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('/logs', [\App\Http\Controllers\Admin\LogViewerController::class, 'index'])->name('admin.logs');
    Route::get('/logs/data', [\App\Http\Controllers\Admin\LogViewerController::class, 'data'])->name('admin.logs.data');
});
