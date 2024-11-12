<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RoleMiddleware
{
    const ROLE_ADMIN = 'admin';

    const ROLE_DOCTOR = 'doctor';

    const ROLE_CASHIER = 'cashier';

    const ROLE_CORDI = 'cordi';

    const ROLE_MANAGER = 'manager';

    const ROLE_PARAMEDIS = 'paramedis';

    const ROLE_PATIENTS = 'patients';

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role)
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Cek apakah role yang diberikan sesuai dengan role user
        if ($user->role !== $role) {
            // Log kejadian akses yang tidak sah
            Log::warning('Unauthorized access attempt by user ID: '.$user->id.' to role: '.$role);

            $roleRedirects = [
                self::ROLE_ADMIN => 'admin.dashboard',
                self::ROLE_DOCTOR => 'doctor.dashboard',
                self::ROLE_CASHIER => 'cashier.dashboard',
                self::ROLE_CORDI => 'cordi.dashboard',
                self::ROLE_MANAGER => 'manager.dashboard',
                self::ROLE_PARAMEDIS => 'paramedis.dashboard',
                self::ROLE_PATIENTS => 'dashboard',
            ];
            $route = $roleRedirects[$user->role] ?? 'login';

            return redirect()->route($route);
        }

        return $next($request);
    }
}
