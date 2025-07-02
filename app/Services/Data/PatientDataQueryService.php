<?php

namespace App\Services\Data;

use App\Models\Ai\Apikey;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class PatientDataQueryService
{
    /**
     * Mengambil data yang dibutuhkan untuk halaman data pasien.
     *
     * @param User $user
     * @return array<string, mixed>
     */
    public function getDataForIndex(User $user): array
    {
        // LOGIKA BISNIS: Audit trail ketika user melihat data diri mereka.
        // AI tidak akan tahu bahwa kita perlu mencatat aktivitas ini.
        Log::info('User accessed their patient data page.', ['user_id' => $user->id]);

        return [
            'patient' => $user->patient, // Menggunakan relasi yang sudah ada di model User
            'apiKey' => Apikey::first()?->api_key,
        ];
    }
} 