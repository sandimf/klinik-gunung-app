<?php

namespace App\Http\Controllers\Roles\Admin\Profile;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class AdminProfileController extends Controller
{
  public function profile()
  {
    return Inertia::render('Profile/Admin');
  }
}
