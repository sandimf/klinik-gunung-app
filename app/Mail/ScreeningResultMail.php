<?php

namespace App\Mail;

use App\Models\Users\Patients;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ScreeningResultMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $patient;

    /**
     * Create a new message instance.
     */
    public function __construct(Patients $patient)
    {
        $this->patient = $patient;
    }

    public function getPatient()
    {
        return $this->patient;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        // Generate PDF dari blade
        $pdf = Pdf::loadView('pdf.screenings.health_check', [
            'screening' => $this->patient,
        ]);
        $pdfContent = $pdf->output();

        return $this->subject('Hasil Screening Kesehatan Anda')
            ->view('mail.screenings.screening-notification')
            ->with([
                'name' => $this->patient->name,
                'notification_message' => 'Berikut terlampir hasil screening kesehatan Anda.',
            ])
            ->attachData($pdfContent, 'hasil_screening.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
