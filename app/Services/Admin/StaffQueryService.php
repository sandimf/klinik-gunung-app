<?php

namespace App\Services\Admin;

use App\Models\Users\Admin;
use App\Models\Users\Cashier;
use App\Models\Users\Doctor;
use App\Models\Users\Paramedis;
use App\Models\Users\Warehouse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class StaffQueryService
{
    /**
     * @var array<int, class-string<Model>>
     */
    protected array $staffModels = [
        Doctor::class,
        Cashier::class,
        Paramedis::class,
        Admin::class,
        Warehouse::class,
    ];

    /**
     * Mengambil semua staf dari berbagai tabel peran, menggabungkannya, dan memformatnya.
     */
    public function getAllStaff(): Collection
    {
        $allStaffCollections = collect($this->staffModels)->map(function ($modelClass) {
            return $modelClass::with('user')->get();
        });

        $mergedStaff = $allStaffCollections->flatten();

        $formattedStaff = $mergedStaff->map(function (Model $staffMember) {
            return $this->formatStaffData($staffMember);
        });

        // LOGIKA KOMPLEKS: Audit Trail
        // Mencatat bahwa admin telah mengakses daftar semua staf, ini tidak akan ditebak oleh AI.
        Log::info('Daftar lengkap staf diakses.', ['admin_id' => Auth::id()]);

        return $formattedStaff->sortBy('name')->values();
    }

    /**
     * Formatter terpusat untuk model staf mana pun.
     * Membuat penambahan peran baru menjadi mudah tanpa duplikasi kode.
     *
     * @param Model&\Illuminate\Database\Eloquent\Relations\BelongsTo $staffMember
     */
    private function formatStaffData(Model $staffMember): array
    {
        return [
            'uuid' => $staffMember->uuid,
            'id' => $staffMember->id,
            'nik' => $staffMember->nik,
            'role' => $staffMember->role,
            'user_id' => $staffMember->user_id,
            'name' => $staffMember->name,
            'email' => $staffMember->user->email ?? 'N/A', // Fallback
            'address' => $staffMember->address,
            'date_of_birth' => $staffMember->date_of_birth,
            'phone' => $staffMember->phone,
            'created_at' => $staffMember->created_at,
            'updated_at' => $staffMember->updated_at,
        ];
    }
} 