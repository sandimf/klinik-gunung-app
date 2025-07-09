<?php

namespace App\Services\Appointments;

use App\Exceptions\SchedulingConflictException;
use App\Jobs\SendAppointmentConfirmation;
use App\Models\Clinic\Appointments;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AppointmentCreationService
{
    /**
     * @throws SchedulingConflictException
     */
    public function create(User $user, array $data): void
    {
        $patient = $user->patient;
        if (! $patient) {
            throw new SchedulingConflictException('Profil pasien tidak ditemukan.');
        }

        $appointmentDateTime = Carbon::parse($data['appointment_date'].' '.$data['appointment_time']);
        $hour = $appointmentDateTime->hour;
        if ($hour < 9 || $hour >= 17) {
            throw new SchedulingConflictException('Janji temu hanya bisa dibuat antara jam 09:00 - 17:00.');
        }

        $existingAppointment = Appointments::where('patient_id', $patient->id)
            ->whereDate('appointment_date', $appointmentDateTime->toDateString())
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($existingAppointment) {
            throw new SchedulingConflictException('Anda sudah memiliki janji temu di tanggal yang sama.');
        }

        $appointment = Appointments::create([
            'appointment_date' => $data['appointment_date'],
            'appointment_time' => $data['appointment_time'].':00',
            'is_scheduled' => $data['is_scheduled'],
            'patient_id' => $patient->id,
            'status' => 'pending',
        ]);

        SendAppointmentConfirmation::dispatch($appointment)->onQueue('notifications');

        Log::info('Janji temu baru berhasil dibuat', ['appointment_id' => $appointment->id, 'patient_id' => $patient->id]);
    }
}
