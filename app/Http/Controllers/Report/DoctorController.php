<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function Index()
    {
        return Inertia::render('Dashboard/Doctor/Report/Index');
    }
}
