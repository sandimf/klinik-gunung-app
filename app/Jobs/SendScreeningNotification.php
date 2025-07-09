<?php

namespace App\Jobs;

use App\Mail\ScreeningResultMail;
use App\Models\Users\Patients;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

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
            \Mail::to($email)->send(new ScreeningResultMail($this->patient));
            \Log::info('Email hasil screening berhasil dikirim ke '.$email);
        } catch (\Exception $e) {
            \Log::error('Gagal mengirim email hasil screening: '.$e->getMessage());
        }
    }
}
