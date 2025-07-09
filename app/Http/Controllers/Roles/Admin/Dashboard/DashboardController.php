<?php

namespace App\Http\Controllers\Roles\Admin\Dashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Admin/Index');
    }

    public function scanner()
    {
        return Inertia::render('Dashboard/Admin/Scaner/Index');
    }
}
