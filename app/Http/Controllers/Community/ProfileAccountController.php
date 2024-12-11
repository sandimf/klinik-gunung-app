<?php

namespace App\Http\Controllers\Community;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Community\Community;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class ProfileAccountController extends Controller
{
    public function index()
    {
        // Ambil ID pengguna yang sedang login
        $userId = Auth::id();
    
        // Ambil data komunitas berdasarkan user_id
        $community = Community::where('user_id', $userId)->first();
    
        // Jika tidak ada komunitas terkait, kembalikan respons error
        if (!$community) {
            abort(404, 'Komunitas tidak ditemukan.');
        }
    
        // Kirim data komunitas ke Inertia
        return Inertia::render('Community/Profile/Edit/EditProfile', [
            'user' => $community,
        ]);
    }

    public function update(Request $request){
        dd($request->all());
    }
}
