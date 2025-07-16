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

    public function index(Request $request): InertiaResponse
    {
        $perPage = 20;
        $search = $request->input('search', '');

        // Ambil semua staff (Collection)
        $allStaff = $this->queryService->getAllStaff();

        // Filter search manual di Collection
        if ($search) {
            $allStaff = $allStaff->filter(function ($staff) use ($search) {
                $search = strtolower($search);

                return str_contains(strtolower($staff['name']), $search)
                    || str_contains(strtolower($staff['email']), $search)
                    || str_contains(strtolower($staff['nik']), $search)
                    || str_contains(strtolower($staff['phone']), $search)
                    || str_contains(strtolower($staff['role']), $search);
            });
        }

        // Pagination manual di Collection
        $page = $request->input('page', 1);
        $total = $allStaff->count();
        $items = $allStaff->slice(($page - 1) * $perPage, $perPage)->values();

        $users = [
            'data' => $items,
            'current_page' => $page,
            'per_page' => $perPage,
            'last_page' => ceil($total / $perPage),
            'prev_page_url' => $page > 1 ? route('staff.index', ['page' => $page - 1, 'search' => $search]) : null,
            'next_page_url' => $page < ceil($total / $perPage) ? route('staff.index', ['page' => $page + 1, 'search' => $search]) : null,
            'total' => $total,
        ];

        return Inertia::render('Dashboard/Admin/MedicalPersonnel/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
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
