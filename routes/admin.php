<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Chatbot\ChatbotController;
use App\Http\Controllers\Roles\Admin\Settings\SocialLoginController;
use App\Http\Controllers\Roles\Admin\Scanner\ScanController;
use App\Http\Controllers\Roles\Admin\AdminDasboardController;
use App\Http\Controllers\Roles\Admin\Log\LogViewerController;
use App\Http\Controllers\Roles\Admin\Management\StaffController;
use App\Http\Controllers\Roles\Admin\Settings\ApiKeyController;
use App\Http\Controllers\Roles\Admin\Management\AmountScreeningController;
use App\Http\Controllers\Roles\Admin\Management\EmergencyContactController;
use App\Http\Controllers\Roles\Admin\Questionnaire\QuestionnaireController;
use App\Http\Controllers\Roles\Admin\Profile\AdminProfileController;
use App\Http\Controllers\Admin\v2\Questioner\QuestionerForScreeningOnlineController;

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
  Route::get('profile', [AdminProfileController::class, 'profile'])->name('admin.profile');
  Route::get('chatbot', [ChatbotController::class, 'index'])->name('chatbot.admin');

  // Staff Management
  Route::resource('staff', StaffController::class)
    ->only(['index', 'store', 'create']);

  Route::patch('staff/{user}/password', [StaffController::class, 'updatePassword'])->name('staff.updatePassword');

  // Questionnaire Management
  Route::resource('questioner', QuestionnaireController::class)
    ->only(['index', 'store', 'update', 'create'])
    ->middleware(['auth']);

  Route::resource('questioner-online', QuestionerForScreeningOnlineController::class)
    ->only(['index', 'store', 'update', 'create'])
    ->middleware(['auth']);

  // Scanner & Security
  Route::get('scan', [ScanController::class, 'index'])->name('admin.scan');
  Route::post('scanning', [ScanController::class, 'decrypt'])->name('decrypt.scan');

  // Login Settings
  Route::resource('auth-settings', SocialLoginController::class)
    ->only(['index', 'update']);

  // Apikey settings
  Route::resource('apikey', ApikeyController::class)
    ->only(['index', 'update']);

  // Emergency Contact Management
  Route::resource('emergecy-contact', EmergencyContactController::class)
    ->only(['index', 'update']);
  Route::resource('settings/emergency', EmergencyContactController::class)
    ->only(['index', 'store']);

  Route::resource('amounts', AmountScreeningController::class)->only(['index', 'store', 'update', 'destroy']);

  // Log Management
  Route::get('/logs', [LogViewerController::class, 'index'])->name('admin.logs');
  Route::get('/logs/data', [LogViewerController::class, 'data'])->name('admin.logs.data');
});
