<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Users\Admin;
use App\Models\Users\Doctor;
use App\Models\Users\Cashier;
use App\Models\Users\Manager;
use App\Models\Users\Paramedis;
use App\Models\Users\Warehouse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StaffRequest;
use Illuminate\Support\Facades\Hash;
use App\Jobs\SendStaffCredentialsEmail;
use App\Http\Requests\Clinic\MedicalPersonnelRequest;
use App\Exceptions\NikExistsException;
use App\Services\Admin\StaffCreationService;
use App\Services\Admin\StaffQueryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function __construct(
        protected StaffQueryService $queryService,
        protected StaffCreationService $creationService
    ) {
    }

    public function index(): InertiaResponse
    {
        $users = $this->queryService->getAllStaff();

        return Inertia::render('Dashboard/Admin/MedicalPersonnel/Index', [
            'users' => $users,
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Dashboard/Admin/MedicalPersonnel/New');
    }

    public function store(StaffRequest $request): RedirectResponse
    {
        try {
            $this->creationService->createStaff($request->validated());
        } catch (NikExistsException $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Gagal membuat staf: ' . $e->getMessage(), ['exception' => $e]);
            return redirect()->back()->with('error', 'Terjadi kesalahan tak terduga saat membuat staf.');
        }

        return redirect()->route('staff.index')->with('message', 'Staf berhasil ditambahkan.');
    }

    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->password = Hash::make($request->password);
        $user->save();

        return redirect()->back()->with('message', 'Password berhasil diubah.');
    }
}
