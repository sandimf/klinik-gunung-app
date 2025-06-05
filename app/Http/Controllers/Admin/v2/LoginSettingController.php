<?php

namespace App\Http\Controllers\Admin\v2;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Auth\SocialLogin;
use App\Http\Controllers\Controller;

class LoginSettingController extends Controller
{
    public function index()
    {
        // Ambil data social login dari database (entri pertama)
        $social = SocialLogin::firstOrCreate([], [
            'google' => false,
        ]);

        return Inertia::render('Dashboard/Admin/AuthSettings/Social', [
            'initialData' => [
                'google' => $social->google,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $socialLogin = SocialLogin::first(); // Ambil pengaturan pertama
        if ($socialLogin) {
            $socialLogin->update($request->only(['google']));
        }
        return redirect()->back()->with('message', 'Social login settings updated successfully!');
    }
}
