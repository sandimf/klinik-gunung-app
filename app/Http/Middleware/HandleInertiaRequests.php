<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Ambil semua flash dari session
        $flash = [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
            'message' => fn () => $request->session()->get('message'),
            'warning' => fn () => $request->session()->get('warning'),
            'info' => fn () => $request->session()->get('info'),
        ];
        // Jika ada salah satu flash, tambahkan _ts unik
        $hasFlash = collect(['success', 'error', 'message', 'warning', 'info'])
            ->some(fn ($k) => $request->session()->has($k));
        if ($hasFlash) {
            $flash['_ts'] = now()->timestamp.uniqid();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'community' => $request->user() && $request->user()->community
                    ? $request->user()->community->toArray()
                    : null,
                // Tambahkan relasi patients untuk user yang sedang login
                'patients' => $request->user() && $request->user()->patients
                    ? $request->user()->patients->toArray()
                    : null,
                'paramedis' => $request->user() && $request->user()->paramedis
                    ? $request->user()->paramedis->toArray()
                    : null,
                'cashier' => $request->user() && $request->user()->cashier
                    ? $request->user()->cashier->toArray()
                    : null,
            ],
            'flash' => $flash,
        ];
    }
}
