<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureCommunityHasUsername
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // Cek apakah user sudah login dan memiliki komunitas dengan username
        if (! $user || ! $user->community || ! $user->community->username) {
            return redirect()->route('create-account.index');
        }

        return $next($request);
    }
}
