<?php

namespace App\Http\Controllers\Paramedis\v2;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class MedicalServiceController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Paramedis/MedicalService/Index');
    }

    public function show($id) {}
}
