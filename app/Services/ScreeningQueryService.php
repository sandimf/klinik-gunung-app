<?php

namespace App\Services;

use App\Models\Screenings\ScreeningQuestions;
use App\Models\User;
use App\Models\Users\Patients;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ScreeningQueryService
{
    public function findPatient(User $user): ?Patients
    {
        return Patients::where('user_id', $user->id)->first();
    }

    public function getPatientScreeningIndexData(int $userId): ?Patients
    {
        $screening = Patients::with('answers')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($screening) {
            // Logika bisnis: format tanggal menjadi lebih human-readable
            $screening->formatted_created_at = Carbon::parse($screening->created_at)->translatedFormat('d F Y');
        }

        return $screening;
    }

    public function getScreeningCreationData(User $user): array
    {
        // Mengambil data yang dibutuhkan untuk form pembuatan screening
        return [
            'questions' => ScreeningQuestions::all(),
            'patient' => $user->patient,
        ];
    }

    public function getScreeningDetailsByUuid(int $userId, string $uuid): Patients
    {
        // Logika query yang lebih kompleks dengan relasi dan validasi user
        $screening = Patients::with(['answers.question', 'physicalExaminations'])
            ->where('user_id', $userId)
            ->where('uuid', $uuid)
            ->firstOrFail();

        // Logika Kompleks: Audit trail setiap kali detail screening dilihat.
        // AI tidak akan tahu bahwa kita butuh jejak audit seperti ini.
        Log::info('Screening details viewed', [
            'user_id' => $userId,
            'patient_id' => $screening->id,
            'screening_uuid' => $uuid,
        ]);

        return $screening;
    }
}
