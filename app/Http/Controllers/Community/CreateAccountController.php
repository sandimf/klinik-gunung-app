<?php

namespace App\Http\Controllers\Community;

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Community\Community;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CreateAccountController extends Controller
{
    public function index()
    {
        // Cek apakah pengguna sudah memiliki username di komunitas
        $user = Auth::user();
        if ($user->community && $user->community->username) {
            // Jika sudah memiliki username, alihkan ke halaman komunitas atau profil
            return redirect()->route('community.index'); // Ganti dengan route yang sesuai
        }

        return Inertia::render('Community/Username/Create');
    }

    public function store(Request $request){
        
        $request->validate([
            'username' => 'required|string|min:3|max:10|regex:/^[a-zA-Z0-9]+$/|unique:community,username',
        ]);    

        // Ambil user yang sedang login
        $user = Auth::user();

        // Cek apakah user sudah memiliki komunitas
        $community = Community::firstOrNew(['user_id' => $user->id]);

        // Set username dan slug
        $community->username = $request->username;
        $community->slug = Str::slug($request->username);

        // Simpan data ke database
        $community->save();

        // Redirect ke halaman profil komunitas berdasarkan slug
        return redirect()->route('community.index', $community->slug)
            ->with('success', 'Username created successfully!');
    }

    public function profile($slug)
    {
        // Cari komunitas berdasarkan slug
        $community = Community::where('slug', $slug)->firstOrFail();
    
        // Tentukan apakah pengguna yang login adalah pemilik komunitas
        $isOwner = Auth::check() && Auth::user()->id === $community->user_id;
    
        // Tampilkan profil komunitas
        return Inertia::render('Community/Profile/Index', [
            'user' => $community,
            'isOwner' => $isOwner,
        ]);
    }

    public function edit(){
        return Inertia::render('Community/Profile/Edit/EditProfile');
    }
    
    
}
