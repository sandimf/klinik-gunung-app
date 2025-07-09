<?php

namespace App\Http\Controllers\Roles\Doctor\Profile;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DoctorProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile/Doctor');
    }
}
