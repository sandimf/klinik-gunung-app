<?php

use App\Http\Controllers\Cashier\v2\ActivityCashierController;
use App\Http\Controllers\Cashier\v2\CompanionController;
use App\Http\Controllers\Chatbot\ChatbotController;
use App\Http\Controllers\Payments\PaymentsOnlineController;
use App\Http\Controllers\Report\CashierReportController;
use App\Http\Controllers\Report\ParamedisReportController;
use App\Http\Controllers\Roles\Cashier\CashierDashboardController;
use App\Http\Controllers\Roles\Cashier\MedicalRecord\CashierMedicalRecordController;
use App\Http\Controllers\Roles\Cashier\Payments\ScreeningPaymentsController;
use App\Http\Controllers\Roles\Cashier\Profile\ProfileCashierController;
use App\Http\Controllers\Roles\Cashier\Screening\ScreeningPaymentListController;
use App\Http\Controllers\Users\CashierController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Finance Routes
|--------------------------------------------------------------------------
|
| Routes for financial operations including cashier and payment functionality
|
*/

// ===================================================================
// CASHIER DASHBOARD ROUTES
// ===================================================================

Route::prefix('dashboard/cashier')->middleware(['role:cashier'])->group(function () {
    // Dashboard & Profile
    Route::get('/', [CashierDashboardController::class, 'index'])->name('cashier.dashboard');
    Route::get('profile', [ProfileCashierController::class, 'index'])->name('cashier.profile');
    Route::get('chatbot', [ChatbotController::class, 'cashier'])->name('chatbot.cashier');

    // Screening Management
    Route::get('screening', [ScreeningPaymentListController::class, 'index'])->name('cashier.screening');
    Route::get('screening-online', [CashierController::class, 'showScreeningOnline'])->name('cashier.screening-online');
    Route::get('screening-online/payments/{id}', [CashierController::class, 'showPayment'])->name('cashier.payments-online');
    Route::get('companion', [CompanionController::class, 'index'])->name('companion.screening');
    Route::get('consultation', [CompanionController::class, 'doctor'])->name('cashier.consultation');

    // Payment Processing
    Route::resource('payments', ScreeningPaymentsController::class)
        ->only(['store'])
        ->middleware(['auth']);

    Route::post('/payments/{id}/confirm', [PaymentsOnlineController::class, 'confirmPayment'])
        ->name('payments.confirm');

    // Payment History
    Route::get('history', [CashierController::class, 'historyPaymentsOffline'])->name('history.cashier');
    Route::get('history-online', [CashierController::class, 'historyPaymentsOnline'])->name('history-online.cashier');

    // Receipt Generation
    Route::get('payments/nota/{paymentId}', [ScreeningPaymentsController::class, 'generateNota'])->name('generate.nota');
    Route::get('nota/{noTransaction}', [ScreeningPaymentsController::class, 'generateNota'])->name('generate.nota.ts');

    // Activity Reports
    Route::get('activity', [CashierReportController::class, 'activity'])->name('cashier.activity');
    Route::get('activity-cashier', [ActivityCashierController::class, 'index'])->name('acitivity-cashier.index');

    // Medical Records Access
    Route::get('medical-record', [CashierMedicalRecordController::class, 'index'])->name('medical-record.cashier');
    Route::get('medical-record/{uuid}', [CashierMedicalRecordController::class, 'show'])->name('show.medical-record.cashier');

    // Health Check Reports
    Route::get('report/health-check/{uuid}', [ParamedisReportController::class, 'generatePDFHealthCheck'])->name('pdf.healthcheck.cashier');
});
