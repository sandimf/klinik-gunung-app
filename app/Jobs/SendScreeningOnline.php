<?php

namespace App\Jobs;

use App\Models\Users\PatientsOnline;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Bus\Dispatchable; // Perhatikan perubahannya, bukan Illuminate\Foundation\Events
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendScreeningOnline implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $patient;

    /**
     * Create a new job instance.
     *
     * @param PatientsOnline $patient
     * @return void
     */
    public function __construct(PatientsOnline $patient)
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

            // Data untuk email
            $data = [
                'name' => $this->patient->name,
                'notification_message' => 'Terima kasih telah melakukan screening. Lakukan pembayaran untuk mendapatkan qrcode.',
            ];

            // Kirim email
            Mail::send('mail.screenings.screening-online', $data, function ($message) use ($email) {
                $message->to($email)
                        ->subject('Pemberitahuan Screening');
            });

            // Logging jika email berhasil dikirim
        } catch (\Exception $e) {
            // Logging jika ada error saat pengiriman email
        }
    }
}
