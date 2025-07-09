<?php

namespace App\Http\Controllers\Roles\Cashier\Profile;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProfileCashierController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile/Cashier');
    }
}
