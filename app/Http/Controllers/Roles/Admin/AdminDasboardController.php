<?php

namespace App\Http\Controllers\Roles\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminDasboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Admin/Index');
    }
}
