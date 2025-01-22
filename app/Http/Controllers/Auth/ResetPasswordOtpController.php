<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\User;
use Inertia\Inertia;

class ResetPasswordOtpController extends Controller
{
    public function show($userId)
    {
        // Menampilkan form untuk memasukkan kode verifikasi
        $user = User::findOrFail($userId);

        return Inertia::render('Auth/ResetPasswordOTP', [
            'user' => $user,
        ]);
    }
}
