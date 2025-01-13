<?php

namespace App\Http\Controllers\Dashboard;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\VisitRepository;

class AdminPanelController extends Controller
{
    public function index(User $user, VisitRepository $visitRepository)
    {
        return Inertia::render('Dashboard/Admin/Index', [
            'visitCount' => $visitCount = $visitRepository->visitCount($user)
        ]);
    }
}
