<?php

namespace App\Jobs;

use App\Models\Users\Patients;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable; // Import Log facade
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncPatientsToAirtable implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $apiKey = env('AIRTABLE_API_KEY');
        $baseId = env('AIRTABLE_BASE_ID');
        $tableName = 'tblhRve40ahLSgGdo'; // Sesuaikan dengan nama tabel di Airtable

        // Log untuk memulai eksekusi job
        Log::info('Starting SyncPatientsToAirtable job.');

        // Ambil pasien yang sudah screening dan belum dikirim ke Airtable
        $patients = Patients::where('health_check_status', 'completed')
            ->whereNull('airtable_id') // Cegah duplikasi
            ->limit(10)
            ->get();

        if ($patients->isEmpty()) {
            Log::info('No patients found to sync.');

            return;
        }

        // Log jumlah pasien yang ditemukan
        Log::info('Found '.$patients->count().' patients to sync.');

        // Format data untuk Airtable API
        $records = [];
        foreach ($patients as $patient) {
            $records[] = [
                'fields' => [
                    'Name' => $patient->name,
                    'Nik' => $patient->nik,
                    'Place of Birth' => $patient->place_of_birth,
                    'Date of Birth' => $patient->date_of_birth,
                    'Gender' => ucfirst($patient->gender),
                    'Address' => $patient->address,
                    'Village' => $patient->village,
                    'District' => $patient->district,
                    'Religion' => $patient->religion,
                    'Marital Status' => $patient->marital_status,
                    'Occupation' => $patient->occupation,
                    'Nationality' => $patient->nationality,
                    'Email' => $patient->email,
                    'Blood Type' => $patient->blood_type,
                    'Age' => $patient->age,
                    'Contact' => $patient->contact,
                    'Health Status' => $patient->health_status,
                ],
            ];
        }

        // Kirim data ke Airtable
        Log::info('Sending data to Airtable API...');
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$apiKey,
            'Content-Type' => 'application/json',
        ])->post("https://api.airtable.com/v0/{$baseId}/{$tableName}", [
            'records' => $records,
        ]);

        // Log status response dari Airtable
        if ($response->successful()) {
            Log::info('Data successfully sent to Airtable.');

            $savedRecords = $response->json('records');

            foreach ($patients as $key => $patient) {
                $patient->update(['airtable_id' => $savedRecords[$key]['id']]);
                Log::info("Updated patient ID {$patient->id} with Airtable ID {$savedRecords[$key]['id']}");
            }
        } else {
            // Log jika permintaan gagal
            Log::error('Failed to send data to Airtable. Response: '.$response->body());
        }
    }
}
