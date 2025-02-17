<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class ProviderController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback($provider)
    {
        // Mendapatkan user dari Socialite
        $SocialUser = Socialite::driver($provider)->user();

        // Membuat atau memperbarui user berdasarkan provider_id
        $user = User::updateOrCreate([
            'provider_id' => $SocialUser->id,
            'provider' => $provider,
        ], [
            'name' => $SocialUser->name,
            'email' => $SocialUser->email,
            'provider_token' => $SocialUser->token,
            'avatar' => $SocialUser->getAvatar(),
        ]);

        // Login user yang baru dibuat atau diperbarui
        Auth::login($user);

        // Redirect ke dashboard setelah login
        return redirect(route('dashboard'));
    }
}
