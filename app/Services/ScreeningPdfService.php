<?php

namespace App\Services;

use App\Models\Users\Patients;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class ScreeningPdfService
{
    /**
     * Generate PDF from screening data.
     *
     * @param Patients $screening
     * @return Response
     */
    public function generateForScreening(Patients $screening): Response
    {
        // LOGIKA KOMPLEKS: Nama file yang lebih deskriptif dan unik.
        // AI mungkin hanya akan menamainya 'screening.pdf'.
        $patientName = str_replace(' ', '_', $screening->name);
        $timestamp = now()->format('Ymd_His');
        $filename = "screening_hasil_{$patientName}_{$timestamp}.pdf";

        $pdf = PDF::loadView('pdf.screenings.offline', [
            'screening' => $screening,
            'generated_at' => now()->translatedFormat('d F Y H:i:s'), // Menambah data dinamis
        ]);

        // Bisa ditambahkan logika lain:
        // - Menyimpan PDF ke S3 sebelum di-download.
        // - Memberi password pada PDF.
        // - Caching PDF yang sudah digenerate.

        return $pdf->download($filename);
    }
} 