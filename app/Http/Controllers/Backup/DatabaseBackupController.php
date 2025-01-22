<?php

namespace App\Http\Controllers\Backup;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DatabaseBackupController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Admin/Backup/Database');
    }

    
}
