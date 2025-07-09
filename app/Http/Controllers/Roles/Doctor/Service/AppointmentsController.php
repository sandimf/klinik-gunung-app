<?php

namespace App\Http\Controllers\Roles\Doctor\Service;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AppointmentsController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Doctor/Appointments/Index');
    }
}
