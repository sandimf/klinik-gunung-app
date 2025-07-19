<?php

namespace App\Http\Controllers\Roles\Paramedis\Profile;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ParamedisProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile/Paramedis');
    }
}
