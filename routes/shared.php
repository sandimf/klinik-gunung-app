<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Chatbot\ChatbotController;
use App\Http\Controllers\Paramedis\ScreeningAiSuggestionController;

/*
|--------------------------------------------------------------------------
| Shared Routes
|--------------------------------------------------------------------------
|
| Routes that are shared across different user roles and functionalities
|
*/

// ===================================================================
// SHARED AUTHENTICATED ROUTES
// ===================================================================

Route::middleware(['auth'])->group(function () {
    // Chatbot functionality
    Route::post('chatbot', [ChatbotController::class, 'post'])->name('chatbot.post');

    // Profile management
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // AI Suggestion for screening
    Route::post('/screening/ai-suggestion', [ScreeningAiSuggestionController::class, 'suggest'])->name('screening.ai.suggestion');

    // Patient physical attributes update
    Route::put('/patients/{id}/physical', [App\Http\Controllers\Users\ParamedisController::class, 'updatePhysicalAttributes'])
        ->name('patients.updatePhysical');
}); 