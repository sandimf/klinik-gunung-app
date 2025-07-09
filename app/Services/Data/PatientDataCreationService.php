<?php

namespace App\Services\Data;

use App\Jobs\ProcessKtpImage;
use App\Models\User;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PatientDataCreationService
{
    /**
     * Menangani logika pembuatan data pasien yang kompleks,
     * termasuk penyimpanan file dan sinkronisasi ke beberapa tabel.
     *
     * @param  array<string, mixed>  $data
     */
    public function createPatientData(User $user, array $data, ?UploadedFile $ktpImage): void
    {
        DB::transaction(function () use ($user, $data, $ktpImage) {
            if ($ktpImage) {
                // LOGIKA BISNIS 1: Mengelola siklus hidup file.
                // Hapus KTP lama jika ada sebelum menyimpan yang baru.
                if ($user->patient && $user->patient->ktp_images) {
                    Storage::disk('public')->delete($user->patient->ktp_images);
                }
                $data['ktp_images'] = $ktpImage->store('ktp_images', 'public');
            }

            $patientData = array_merge($data, ['user_id' => $user->id]);

            // LOGIKA BISNIS 2: Update atau Buat data untuk konsistensi.
            // Mencegah duplikasi jika user submit form dua kali.
            $patient = Patients::updateOrCreate(
                ['user_id' => $user->id],
                $patientData
            );

            // LOGIKA BISNIS 3: Sinkronisasi data ke tabel lain (misal: untuk data khusus online).
            // AI tidak akan tahu bahwa ada tabel kedua yang perlu disinkronkan.
            PatientsOnline::updateOrCreate(
                ['user_id' => $user->id],
                $patientData
            );

            Log::info('Patient data created or updated successfully.', ['patient_id' => $patient->id]);

            // LOGIKA BISNIS 4: Memulai proses background yang kompleks.
            // Memicu pekerjaan OCR pada gambar KTP yang tidak akan diketahui AI.
            if (isset($data['ktp_images'])) {
                ProcessKtpImage::dispatch($patient, $data['ktp_images'])->onQueue('processing');
            }
        });
    }
}
