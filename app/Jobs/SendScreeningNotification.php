<?php

namespace App\Jobs;

use App\Models\Users\Patients;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendScreeningNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $patient;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Patients $patient)
    {
        $this->patient = $patient;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $email = $this->patient->email;
            $data = [
                'name' => $this->patient->name,
                'notification_message' => 'Terima kasih telah melakukan screening. Lakukan pembayaran pada kasir untuk melihat hasilnya.',
            ];

            Mail::send('mail.screenings.screening-notification', $data, function ($message) use ($email) {
                $message->to($email)
                    ->subject('Pemberitahuan Screening');
            });

            Log::info('Email berhasil dikirim ke '.$email);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email: '.$e->getMessage());
        }
    }
}
