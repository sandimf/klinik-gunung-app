<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\Community\Community;
use App\Models\Community\CommunityPost;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommunityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil postingan yang sudah disetujui, dan sertakan data profil pembuatnya
        $posts = CommunityPost::with(['community.user'])
            ->where('status', 'approve')
            ->latest()
            ->paginate(15);

        return Inertia::render('Community/Index', [
            'posts' => $posts,
        ]);
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
