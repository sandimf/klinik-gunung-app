<?php

namespace App\Services;

use App\Events\NewScreeningEvent;
use App\Jobs\NotifyClinicStaffOfNewScreening;
use App\Models\Notifications\Notification;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\User;
use App\Models\Users\Patients;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ScreeningSubmissionService
{
    public function handle(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data) {
            // 1. LOGIKA KOMPLEKS: Generate nomor antrian harian yang aman (atomic).
            // Ini mencegah dua user mendapatkan nomor antrian yang sama jika submit bersamaan.
            $today = Carbon::today();
            $lastQueue = DB::table('patients')
                ->whereDate('screening_date', $today)
                ->lockForUpdate() // Mengunci baris untuk mencegah race condition
                ->max('queue') ?? 0;

            $newQueueNumber = $lastQueue + 1;

            // Cari pasien berdasarkan email untuk menghindari duplikasi email
            $patient = Patients::where('email', $data['email'])->first();

            if (! $patient) {
                $patient = new Patients;
            }

            $patient->fill([
                'user_id' => $user->id,
                'name' => $data['name'],
                'age' => $data['age'],
                'gender' => $data['gender'],
                'contact' => $data['contact'],
                'email' => $data['email'],
                'screening_status' => 'pending',
                'health_status' => 'pending',
                'health_check_status' => 'pending',
                'payment_status' => 'pending',
                'queue' => $newQueueNumber, // Menyimpan nomor antrian baru
                'screening_date' => $today, // Menyimpan tanggal screening
            ]);
            $patient->save();

            // Hapus jawaban lama jika ada, untuk memastikan data bersih
            $patient->answers()->delete();

            foreach ($data['answers'] as $answer) {
                $answer_content = $answer['answer'];
                $answer_text = '';

                if (is_array($answer_content)) {
                    // Cek apakah ini array assosiatif dari checkbox_textarea
                    if (array_key_exists('options', $answer_content) || array_key_exists('textarea', $answer_content)) {
                        $options = ! empty($answer_content['options']) ? implode(', ', $answer_content['options']) : 'N/A';
                        $textarea = $answer_content['textarea'] ?? '';
                        $answer_text = json_encode(['options' => $options, 'textarea' => $textarea]);
                    } else {
                        // Ini adalah array biasa dari checkbox
                        $answer_text = implode(', ', $answer_content);
                    }
                } else {
                    // Ini adalah jawaban string biasa
                    $answer_text = $answer_content;
                }

                ScreeningAnswers::create([
                    'question_id' => $answer['questioner_id'],
                    'patient_id' => $patient->id,
                    'answer_text' => $answer_text,
                    'queue' => $newQueueNumber,
                ]);
            }

            // 2. LOGIKA KOMPLEKS: Integrasi dengan proses lain via background Job.
            // Memberi notifikasi pada staf klinik tanpa memperlambat response user.
            NotifyClinicStaffOfNewScreening::dispatch($patient)->onQueue('high');

            // 3. REALTIME NOTIFICATION: Kirim notifikasi realtime ke paramedis
            $this->sendRealtimeNotification($patient);
        });
    }

    /**
     * Send realtime notification to paramedics
     */
    private function sendRealtimeNotification(Patients $patient): void
    {
        try {
            // Get all paramedics
            $paramedics = \App\Models\Users\Paramedis::all();

            foreach ($paramedics as $paramedic) {
                // Create notification record
                Notification::create([
                    'user_id' => $paramedic->user_id,
                    'type' => 'new_screening',
                    'title' => 'Screening Baru',
                    'message' => "Pasien baru: {$patient->name} (Antrian: {$patient->queue})",
                    'data' => [
                        'patient_id' => $patient->id,
                        'patient_name' => $patient->name,
                        'queue_number' => $patient->queue,
                        'screening_date' => $patient->screening_date,
                        'screening_id' => $patient->id,
                    ],
                ]);

                // Broadcast realtime event
                broadcast(new NewScreeningEvent($patient))->toOthers();
            }
        } catch (\Exception $e) {
            \Log::error('Error sending realtime notification: '.$e->getMessage());
        }
    }
}
