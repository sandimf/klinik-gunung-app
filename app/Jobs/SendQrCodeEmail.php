<?php

namespace App\Jobs;

use App\Mail\QrCodeMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendQrCodeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $patient;
    protected $qrCodePath;

    /**
     * Create a new job instance.
     *
     * @param $patient
     * @param $qrCodePath
     */
    public function __construct($patient, $qrCodePath)
    {
        $this->patient = $patient;
        $this->qrCodePath = $qrCodePath; // Relatif dari Storage
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
            $name = $this->patient->name;
    
            // Dapatkan URL QR Code
            $qrCodeUrl = Storage::url($this->qrCodePath);
    
            // Data untuk email
            $data = [
                'name' => $name,
                'qrCodeUrl' => $qrCodeUrl,
            ];
    
            // Kirim email menggunakan view
            Mail::send('mail.screenings.qrcode', $data, function ($message) use ($email) {
                $message->to($email)
                        ->subject('Your QR Code is Ready');
            });
    
            Log::info('Email berhasil dikirim ke ' . $email);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email: ' . $e->getMessage());
        }
    }
    
}