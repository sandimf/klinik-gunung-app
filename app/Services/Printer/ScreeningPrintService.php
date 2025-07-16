<?php

namespace App\Services\Printer;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ScreeningPrintService
{
    public static function printScreening($medicalRecord, $examiner = null, $printerName = 'Canon_TS300_series_IP3')
    {
        $medicalRecordNumber = $medicalRecord->medical_record_number ?? '-';

        // Ambil bulan dari tanggal pemeriksaan (created_at)
        $bulan = $medicalRecord->created_at ? $medicalRecord->created_at->format('n') : null;

        // Konversi ke Romawi
        function bulanRomawi($bulan)
        {
            $romawi = [
                1 => 'I',
                2 => 'II',
                3 => 'III',
                4 => 'IV',
                5 => 'V',
                6 => 'VI',
                7 => 'VII',
                8 => 'VIII',
                9 => 'IX',
                10 => 'X',
                11 => 'XI',
                12 => 'XII',
            ];

            return $romawi[$bulan] ?? '-';
        }

        $bulanRomawi = $bulan ? bulanRomawi($bulan) : '-';

        // Ambil data pasien untuk PDF
        $screening = $medicalRecord->patient;

        // Simpan signature ke file jika ada
        $signaturePath = null;
        if ($examiner && $examiner->signature) {
            if (preg_match('/^data:image\\/(png|jpeg);base64,/', $examiner->signature, $matches)) {
                $ext = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
                $signatureData = substr($examiner->signature, strpos($examiner->signature, ',') + 1);
                $signatureData = base64_decode($signatureData);
                $filename = 'signatures/examiner_'.$examiner->id.'_'.time().'.'.$ext;
                Storage::disk('public')->put($filename, $signatureData);
                $signaturePath = storage_path('app/public/'.$filename);
            }
        }

        $pdf = Pdf::loadView('pdf.screenings.health_check', [
            'screening' => $screening,
            'medical_record_number' => $medicalRecordNumber,
            'bulan_romawi' => $bulanRomawi,
            'examiner_name' => $examiner ? $examiner->name : null,
            'examiner_signature_path' => $signaturePath,
        ]);

        $filename = 'hasil_screening_'.$screening->id.'.pdf';
        $path = storage_path('app/public/'.$filename);

        // 2. Simpan PDF ke storage
        file_put_contents($path, $pdf->output());

        // 3. Kirim perintah print ke printer via shell_exec
        $output = shell_exec("lp -d {$printerName} -o media=A5 '{$path}'");

        // 4. (Opsional) Hapus file setelah print
        // unlink($path);

        return $output;
    }
}
