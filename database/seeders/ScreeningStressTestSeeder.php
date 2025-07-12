<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ScreeningStressTestSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();
        $patients = [];
        $answers = [];
        $total = 10000;
        $questions = range(1, 8); // id pertanyaan 1-8

        for ($i = 1; $i <= $total; $i++) {
            $uuid = (string) Str::uuid();
            $patients[] = [
                'uuid' => $uuid,
                'nik' => '99999999'.str_pad($i, 6, '0', STR_PAD_LEFT),
                'name' => 'Test User '.$i,
                'place_of_birth' => 'Test City',
                'date_of_birth' => '2000-01-01',
                'rt_rw' => '001/001',
                'address' => 'Test Address',
                'village' => 'Test Village',
                'district' => 'Test District',
                'religion' => 'ISLAM',
                'marital_status' => 'BELUM KAWIN',
                'occupation' => 'PELAJAR',
                'nationality' => 'WNI',
                // 'valid_until' => 'SEUMUR HIDUP',
                'age' => '30',
                'tinggi_badan' => '30',
                'berat_badan' => '30',
                'blood_type' => '-',
                'contact' => '08123456789',
                'email' => 'testuser'.$i.'@example.com',
                'screening_status' => 'pending',
                'health_status' => 'pending',
                'health_check_status' => 'pending',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        // Insert patients in batch
        $chunks = array_chunk($patients, 1000);
        foreach ($chunks as $chunk) {
            DB::table('patients')->insert($chunk);
        }
        // Ambil semua id pasien yang baru saja diinsert
        $patientIds = DB::table('patients')->orderBy('id', 'desc')->limit($total)->pluck('id')->reverse()->values();
        $queue = 1;
        foreach ($patientIds as $pid) {
            foreach ($questions as $qid) {
                $answers[] = [
                    'patient_id' => $pid,
                    'question_id' => $qid,
                    'answer_text' => 'Jawaban test '.$qid,
                    'queue' => $queue++,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }
        // Insert answers in batch
        $answerChunks = array_chunk($answers, 1000);
        foreach ($answerChunks as $chunk) {
            DB::table('screening_offline_answers')->insert($chunk);
        }
    }
}
