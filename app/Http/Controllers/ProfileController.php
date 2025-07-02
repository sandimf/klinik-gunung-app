<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Services\AccountDeletionService;
use App\Services\ProfileService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService,
        protected AccountDeletionService $accountDeletionService
    ) {}

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            $this->profileService->updateUser(
                $request->user(),
                $request->validated(),
                $request->hasFile('avatar') ? $request->file('avatar') : null
            );
        } catch (\Exception $e) {
            // Jika terjadi error di service, kita bisa menangkapnya di sini
            // dan memberikan feedback yang sesuai ke user.
            report($e); // Melaporkan exception ke sistem logging Laravel
            return back()->with('error', 'Gagal memperbarui profil. Silakan coba lagi.');
        }

        return back()->with('success', 'Profile Berhasil Diperbarui');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $this->accountDeletionService->deleteUserAccount($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/')->with('success', 'Akun Anda telah dijadwalkan untuk dihapus.');
    }
}
