<?php

namespace App\Http\Controllers\Cashier\v2;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ServiceTypeController extends Controller
{
  public function index()
  {
    return Inertia::render('Dashboard/Cashier/Services/Index');
  }
}
