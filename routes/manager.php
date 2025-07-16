<?php

use App\Http\Controllers\Dashboard\ManagerPanelController;
use App\Http\Controllers\Report\ManagerReportController;
use App\Http\Controllers\Report\ParamedisReportController;
use App\Http\Controllers\Users\ManagerController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Manager Routes
|--------------------------------------------------------------------------
|
| Routes for manager dashboard and reporting functionality
|
*/

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
