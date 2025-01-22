<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Medicines\Medicine;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Warehouse/Index');
    }

    public function medicine()
    {
        Cache::forget('medicines_list');

        // Menggunakan cache untuk meningkatkan performa query
        $medicines = Cache::remember('medicines_list', now()->addMinutes(10), function () {
            return Medicine::with(['pricing', 'batches'])->latest()->paginate(10);
        });

        return Inertia::render('Dashboard/Warehouse/Apotek/Index', [
            'medicines' => $medicines,
        ]);
    }

    public function profile()
    {
        return Inertia::render('Profile/Warehouse');
    }
}
