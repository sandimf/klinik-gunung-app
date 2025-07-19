<?php

use App\Http\Controllers\Api\PatientDataController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ParamedisScreeningController;
use App\Models\Notifications\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Notification Routes
Route::middleware(['web'])->prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'getNotifications']);
    Route::get('/unread-count', [NotificationController::class, 'getUnreadCount']);
    Route::post('/mark-read', [NotificationController::class, 'markAsRead']);
    Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::get('/recent-screenings', [NotificationController::class, 'getRecentScreenings']);
});

// Paramedis Screening Routes
Route::middleware(['web'])->prefix('paramedis')->group(function () {
    Route::get('/screenings', [ParamedisScreeningController::class, 'getScreenings']);
    Route::get('/screenings/count', [ParamedisScreeningController::class, 'getScreeningCount']);
});

// Server-Sent Events for realtime notifications
Route::middleware(['web'])->get('/notifications/stream', function (Request $request) {
    if (! auth()->check()) {
        abort(401);
    }

    $user = auth()->user();
    if ($user->role !== 'paramedis') {
        abort(403);
    }

    // Set headers for SSE
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Cache-Control');
    header('X-Accel-Buffering: no'); // Disable nginx buffering

    // Send initial connection message
    echo 'data: '.json_encode(['type' => 'connected', 'message' => 'SSE Connected'])."\n\n";
    ob_flush();
    flush();

    // Simple heartbeat approach - just send ping every 30 seconds
    $startTime = time();
    $timeout = 300; // 5 minutes

    while (true) {
        // Check timeout
        if (time() - $startTime > $timeout) {
            echo 'data: '.json_encode(['type' => 'timeout', 'message' => 'Connection timeout'])."\n\n";
            ob_flush();
            flush();
            break;
        }

        // Send ping every 30 seconds
        if (time() % 30 === 0) {
            echo 'data: '.json_encode(['type' => 'ping', 'timestamp' => time()])."\n\n";
            ob_flush();
            flush();
        }

        // Check if client is still connected
        if (connection_aborted()) {
            break;
        }

        sleep(1);
    }
});

// Patient Data API Routes (accessed via QR code)
Route::prefix('v1')->group(function () {
    Route::get('/tb0xPxDOVTRmhejyE3Wukn4QBni/patient/{uniqueLink}/H0u01BshX7nsyxm0Qkeqa8N9odxvmAzC', [PatientDataController::class, 'getPatientData']);
    Route::get('/verify/{uniqueLink}', [PatientDataController::class, 'verifyQrCode']);
});


Route::middleware(['web', 'auth'])->prefix('cashier')->group(function () {
    Route::get('/notifications', function () {
        $user = auth()->user();

        return \App\Models\Notifications\Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();
    });
});
