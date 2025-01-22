<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Inertia\Inertia;

class ManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Dashboard/Manager/Index');
    }

    public function profile()
    {
        return Inertia::render('Profile/Manager');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function screening()
    {
        // Query screenings from Patients model (Offline)
        $offlineScreenings = Patients::with(['answers.question', 'physicalExaminations.paramedis', 'physicalExaminations.doctor'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->get();

        // Query screenings from PatientsOnline model (Online)
        $onlineScreenings = PatientsOnline::with(['answers.question', 'physicalExaminations.paramedis', 'physicalExaminations.doctor'])
            ->whereHas('answers', function ($query) {
                $query->whereNotNull('answer_text');
            })
            ->where('screening_status', 'completed')
            ->get();

        // Gabungkan data screening offline dan online ke dalam satu koleksi
        $screenings = collect([])->merge($offlineScreenings)->merge($onlineScreenings);

        // Kembalikan ke tampilan Inertia dengan data screenings
        return Inertia::render('Dashboard/Manager/Screenings/Index', [
            'screenings' => $screenings->all(),
        ]);
    }
}
