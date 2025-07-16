<?php

use App\Http\Controllers\Community\CommunityController;
use App\Http\Controllers\Community\CreateAccountController;
use App\Http\Controllers\Community\ProfileAccountController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Community Routes
|--------------------------------------------------------------------------
|
| Routes for community features and account management
|
*/

// ===================================================================
// COMMUNITY ACCOUNT MANAGEMENT
// ===================================================================

Route::resource('community/create-account', CreateAccountController::class)
    ->only(['index', 'store']);

Route::resource('community/accounts', ProfileAccountController::class)
    ->only(['index', 'store', 'update']);

// ===================================================================
// COMMUNITY FEATURES (requires username)
// ===================================================================

Route::middleware(['check.username'])->group(function () {
    Route::resource('community', CommunityController::class)
        ->only(['index']);

    Route::get('community/new-post', [CommunityController::class, 'create'])->name('community.create');

    Route::get('/community/{slug}', [CreateAccountController::class, 'profile'])
        ->name('profile.show');
});
