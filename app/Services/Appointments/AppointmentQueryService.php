<?php

namespace App\Services\Appointments;

use App\Models\Clinic\Appointments;
use App\Models\User;
use Illuminate\Support\Collection;

class AppointmentQueryService
{
    /**
     * Mengambil data janji temu untuk user.
     * Mengembalikan null jika profil pasien tidak ada.
     *
     * @param User $user
     * @return Collection|null
     */
    public function getAppointmentsForUser(User $user): ?Collection
    {
        $patient = $user->patient;

        if (!$patient) {
            return null;
        }

        return Appointments::with('patient')
            ->where('patient_id', $patient->id)
            ->latest('created_at')
            ->get();
    }
} 