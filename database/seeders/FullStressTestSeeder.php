<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FullStressTestSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();
        $total = 10000;
        // 1. Users (hanya role patients)
        $users = [];
        for ($i = 1; $i <= $total; $i++) {
            $users[] = [
                'name' => 'Patient User '.$i,
                'email' => 'patient'.$i.'@example.com',
                'role' => 'patients',
                'password' => bcrypt('password'),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('users')->insert($users);
        $userIds = DB::table('users')->orderBy('id', 'desc')->limit($total)->pluck('id')->reverse()->values();

        // 2. Patients
        $patients = [];
        foreach ($userIds as $i => $userId) {
            $patients[] = [
                'uuid' => (string) Str::uuid(),
                'user_id' => $userId,
                'nik' => '99999999'.str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'name' => 'Patient '.($i + 1),
                'screening_status' => 'pending',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('patients')->insert($patients);
        $patientIds = DB::table('patients')->orderBy('id', 'desc')->limit($total)->pluck('id')->reverse()->values();

        // 3. Screening Offline Answers
        $answers = [];
        foreach ($patientIds as $pid) {
            for ($q = 1; $q <= 8; $q++) {
                $answers[] = [
                    'patient_id' => $pid,
                    'question_id' => $q,
                    'answer_text' => 'Jawaban test '.$q,
                    'queue' => $q,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }
        foreach (array_chunk($answers, 1000) as $chunk) {
            DB::table('screening_offline_answers')->insert($chunk);
        }

        // 4. Payments
        $payments = [];
        foreach ($patientIds as $i => $pid) {
            $payments[] = [
                'patient_id' => $pid,
                'amount_paid' => rand(10000, 100000),
                'payment_status' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        foreach (array_chunk($payments, 1000) as $chunk) {
            DB::table('payments')->insert($chunk);
        }

        // 5. Transaction
        $transactions = [];
        foreach ($patientIds as $i => $pid) {
            $transactions[] = [
                'patient_id' => $pid,
                'total_price' => rand(10000, 100000),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        foreach (array_chunk($transactions, 1000) as $chunk) {
            DB::table('transaction')->insert($chunk);
        }
    }
}
