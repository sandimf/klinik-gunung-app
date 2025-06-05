<?php

namespace App\Http\Controllers\Admin\v2;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Users\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Repositories\VisitRepository;

class AdminPanelController extends Controller
{

    protected $user;

    public function __construct()
    {
        $this->user = Auth::user();  // Menyimpan user di properti kelas
    }
    public function index(User $user, VisitRepository $visitRepository)
    {
        return Inertia::render('Dashboard/Admin/Index', [
            'visitCount' => $visitCount = $visitRepository->visitCount($user),
        ]);
    }

    public function profile()
    {
        $patient = Admin::where('user_id', $this->user->id)->first();

        return Inertia::render('Profile/Admin');
    }
}
