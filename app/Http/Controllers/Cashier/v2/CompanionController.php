<?php

namespace App\Http\Controllers\Cashier\v2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Users\Patients;
use Inertia\Inertia;
use App\Models\Medicines\Medicine;


class CompanionController extends Controller
{
    public function index()
    {
        $screenings = Patients::with(['answers.question'])
            ->where('payment_status', 'pending')
            ->where('health_status', 'butuh_pendamping')
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->get();

        // Muat semua obat
        $medicines = Medicine::with('pricing')->get();

        return Inertia::render('Dashboard/Cashier/Companion/Index', [
            'screenings' => $screenings,
            'medicines' => $medicines,
        ]);
    }

}
