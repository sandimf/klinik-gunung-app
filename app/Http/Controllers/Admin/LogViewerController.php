<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class LogViewerController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Dashboard/Admin/Logs/Index');
    }

    public function data()
    {
        $logPath = storage_path('logs/laravel.log');
        $logs = [];

        if (File::exists($logPath)) {
            $lines = file($logPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            $logs = array_slice($lines, -100); // hanya 100 baris terakhir
        }

        return response()->json(['logs' => $logs]);
    }
}
