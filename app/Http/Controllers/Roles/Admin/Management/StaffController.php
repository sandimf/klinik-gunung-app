<?php

namespace App\Http\Controllers\Roles\Admin\Management;

use App\Exceptions\NikExistsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StaffRequest;
use App\Models\User;
use App\Services\Admin\StaffCreationService;
use App\Services\Admin\StaffQueryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class StaffController extends Controller
{
    public function __construct(
        protected StaffQueryService $queryService,
        protected StaffCreationService $creationService
    ) {}

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
            Log::error('Gagal membuat staf: '.$e->getMessage(), ['exception' => $e]);

            return redirect()->back()->with('error', 'Terjadi kesalahan tak terduga saat membuat staf.');
        }

        return redirect()->route('staff.index')->with('success', 'Staf berhasil ditambahkan.');
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
