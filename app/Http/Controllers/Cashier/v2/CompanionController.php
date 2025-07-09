<?php

namespace App\Http\Controllers\Cashier\v2;

use App\Http\Controllers\Controller;
use App\Models\Medicines\Medicine;
use App\Models\Roles\Admin\Management\AmountScreening;
use App\Models\Users\Patients;
use Inertia\Inertia;

class CompanionController extends Controller
{
    public function index()
    {
        $screenings = Patients::with(['answers.question'])
            ->whereIn('pendampingan', [
                'pendampingan_perawat',
                'pendampingan_paramedis',
                'pendampingan_dokter',
            ])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->get();

        // Muat semua obat
        $medicines = Medicine::with(['pricing', 'batches'])->get();
        $amounts = AmountScreening::all();

        return Inertia::render('Dashboard/Cashier/Companion/Index', [
            'screenings' => $screenings,
            'medicines' => $medicines,
            'amounts' => $amounts,
        ]);
    }

    public function doctor()
    {
        $screenings = Patients::with(['answers.question'])
            // ->where('payment_status', 'pending')
            ->where('konsultasi_dokter', 1)
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->get();

        // Muat semua obat
        $medicines = Medicine::with('pricing')->get();
        $amounts = AmountScreening::all();

        return Inertia::render('Dashboard/Cashier/Consultation/Index', [
            'screenings' => $screenings,
            'medicines' => $medicines,
            'amounts' => $amounts,
        ]);
    }
}
