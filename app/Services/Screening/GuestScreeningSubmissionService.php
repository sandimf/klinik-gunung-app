<?php

namespace App\Services\Screening;

use App\Events\NewScreeningEvent;
use App\Exceptions\NikAlreadyExistsException;
use App\Models\Notifications\Notification;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\User;
use App\Models\Users\Paramedis;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GuestScreeningSubmissionService
{
    /**
     * @throws NikAlreadyExistsException
     * @throws \Throwable
     */
    public function handle(array $validatedData, ?UploadedFile $ktpImage): void
    {
        Log::info('Mulai handle screening guest', $validatedData);

        DB::transaction(function () use ($validatedData, $ktpImage) {
            $data = $this->formatPersonalData($validatedData);

            Log::info('Setelah formatPersonalData', $data);

            Log::info('NIK unik', ['nik' => $data['nik']]);

            if ($ktpImage) {
                $data['ktp_images'] = $ktpImage->store('ktp_images', 'public');
            }

            ['user' => $user, 'password' => $plainPassword] = $this->findOrCreateUser($data['email'], $data['name']);
            Log::info('User ditemukan/dibuat', ['user_id' => $user->id]);

            $patient = $this->createPatientProfiles($user, $data);
            Log::info('Patient dibuat', ['patient_id' => $patient->id]);

            $this->saveScreeningAnswers($patient, $validatedData['answers']);
            Log::info('Screening answers disimpan', ['patient_id' => $patient->id]);

            // Send notifications to paramedics
            $this->sendNotificationsToParamedics($patient);
        });
    }

    private function formatPersonalData(array $data): array
    {
        $fieldsToFormat = [
            'name', 'place_of_birth', 'district', 'village', 'address',
            'occupation', 'religion', 'nationality', 'gender', 'marital_status', 'tinggi_badan', 'berat_badan',
        ];

        foreach ($fieldsToFormat as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = ucwords(strtolower($data[$field]));
            }
        }

        return $data;
    }

    private function findOrCreateUser(string $email, string $name): array
    {
        $user = User::where('email', $email)->first();
        if ($user) {
            return ['user' => $user, 'password' => null];
        }

        $password = Str::random(10);
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        return ['user' => $user, 'password' => $password];
    }

    private function createPatientProfiles(User $user, array $data): Patients
    {
        // Generate queue number for today
        $today = Carbon::today();
        $lastQueue = DB::table('patients')
            ->whereDate('screening_date', $today)
            ->lockForUpdate()
            ->max('queue') ?? 0;

        $newQueueNumber = $lastQueue + 1;

        $patientData = array_merge($data, [
            'user_id' => $user->id,
            'screening_status' => 'pending',
            'health_status' => 'pending',
            'health_check_status' => 'pending',
            'payment_status' => 'pending',
            'queue' => $newQueueNumber,
            'screening_date' => $today,
        ]);

        PatientsOnline::create($patientData);

        return Patients::create($patientData);
    }

    private function saveScreeningAnswers(Patients $patient, array $answers): void
    {
        $lastQueueToday = DB::table('screening_offline_answers')->whereDate('created_at', Carbon::today())->max('queue') ?? 0;

        foreach ($answers as $index => $answer) {
            $answerText = $this->parseComplexAnswer($answer['answer']);

            ScreeningAnswers::create([
                'question_id' => $answer['questioner_id'],
                'patient_id' => $patient->id,
                'answer_text' => $answerText,
                'queue' => $lastQueueToday + $index + 1,
            ]);
        }
    }

    private function parseComplexAnswer($answerData): string
    {
        if (! is_array($answerData) || empty($answerData)) {
            return (string) ($answerData ?? '');
        }

        $parts = [];
        // Handle struktur { options: [...], textarea: '...' }
        if (isset($answerData['options']) && is_array($answerData['options'])) {
            $parts[] = implode(', ', $answerData['options']);
        }
        if (isset($answerData['textarea']) && ! empty($answerData['textarea'])) {
            $parts[] = $answerData['textarea'];
        }

        if (empty($parts)) {
            return implode(', ', array_filter($answerData));
        }

        return implode(', ', array_filter($parts));
    }

    /**
     * Send notifications to all paramedics
     */
    private function sendNotificationsToParamedics(Patients $patient): void
    {
        try {
            // Get all paramedics
            $paramedics = Paramedis::all();

            foreach ($paramedics as $paramedic) {
                // Create notification record
                Notification::create([
                    'user_id' => $paramedic->user_id,
                    'type' => 'new_screening',
                    'title' => 'Screening Baru (Guest)',
                    'message' => "Pasien baru: {$patient->name} (Antrian: {$patient->queue})",
                    'data' => [
                        'patient_id' => $patient->id,
                        'patient_name' => $patient->name,
                        'queue_number' => $patient->queue,
                        'screening_date' => $patient->screening_date,
                        'screening_id' => $patient->id,
                        'is_guest' => true,
                    ],
                ]);

                // Broadcast realtime event
                broadcast(new NewScreeningEvent($patient))->toOthers();
            }

            Log::info('Notifications sent to paramedics', [
                'patient_id' => $patient->id,
                'paramedics_count' => $paramedics->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error sending notifications to paramedics: '.$e->getMessage());
        }
    }
}
