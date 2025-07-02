<?php

namespace App\Services\Appointments;

use App\Exceptions\SchedulingConflictException;
use App\Jobs\NotifyStaffOfCancellation;
use App\Models\Clinic\Appointments;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AppointmentCancellationService
{
    /**
     * @throws SchedulingConflictException
     */
    public function cancel(User $user, int $appointmentId): void
    {
        $patient = $user->patient;
        if (!$patient) {
            throw new SchedulingConflictException('Profil pasien tidak ditemukan.');
        }
        
        $appointment = Appointments::where('id', $appointmentId)
            ->where('patient_id', $patient->id)
            ->firstOrFail(); 
        
        $appointmentDateTime = Carbon::parse($appointment->appointment_date . ' ' . $appointment->appointment_time);

        if (Carbon::now()->diffInHours($appointmentDateTime) < 24) {
            throw new SchedulingConflictException('Janji temu tidak dapat dibatalkan kurang dari 24 jam sebelumnya.');
        }

        $appointment->status = 'cancelled';
        $appointment->save();

        NotifyStaffOfCancellation::dispatch($appointment)->onQueue('notifications');

        Log::info('Janji temu dibatalkan oleh user', [
            'appointment_id' => $appointment->id, 
            'patient_id' => $patient->id
        ]);
    }
} 