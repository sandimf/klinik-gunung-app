<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\Community\Community;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileAccountController extends Controller
{
    public function index()
    {
        // Ambil ID pengguna yang sedang login
        $userId = Auth::id();

        // Ambil data komunitas berdasarkan user_id
        $community = Community::where('user_id', $userId)->first();

        // Jika tidak ada komunitas terkait, kembalikan respons error
        if (! $community) {
            abort(404, 'Komunitas tidak ditemukan.');
        }

        // Kirim data komunitas ke Inertia
        return Inertia::render('Community/Profile/Edit/EditProfile', [
            'user' => $community,
        ]);
    }

    public function update(Request $request)
    {
        dd($request->all());
    }
}
