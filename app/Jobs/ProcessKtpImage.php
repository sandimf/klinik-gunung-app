<?php

namespace App\Jobs;

// use App\Models\Patient; // Hapus jika tidak dipakai
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessKtpImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $patient;
    public $ktpImages;

    /**
     * Create a new job instance.
     */
    public function __construct($patient, $ktpImages)
    {
        $this->patient = $patient;
        $this->ktpImages = $ktpImages;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // TODO: Implementasi proses OCR atau logika lain pada gambar KTP di sini.
        // Contoh:
        // OcrService::process($this->ktpImages, $this->patient);
    }
} 