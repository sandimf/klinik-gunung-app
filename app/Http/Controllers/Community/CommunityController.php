<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\Community\Community;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommunityController extends Controller
{
    public function index()
    {
        return Inertia::render('Community/Index');
    }

    public function show()
    {
        return 'oke';
    }

    public function create()
    {
        $userId = Auth::id();
        // Ambil data komunitas berdasarkan user_id
        $community = Community::where('user_id', $userId)->first();
        // Jika tidak ada komunitas terkait, kembalikan respons error
        if (! $community) {
            abort(404, '403');
        }

        return Inertia::render('Community/Post/Index', [
            'user' => $community,
        ]);
    }

    public function store()
    {
        return Inertia::render('Community/Post/Index');
    }
}
