<?php

namespace App\Http\Controllers\Cashier\v2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceTypeController extends Controller
{
    public function index()
    {
        return Inertia::render("Dashboard/Cashier/ServiceType/Index");
    }
}
