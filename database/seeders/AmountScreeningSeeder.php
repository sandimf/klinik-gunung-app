<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AmountScreeningSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('amount_screening')->insert([
            [
                'type' => 'Screening',
                'amount' => 50000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Pendampingan Perawat',
                'amount' => 30000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Pendampingan Paramedis',
                'amount' => 25000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Pendampingan Dokter',
                'amount' => 30000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'type' => 'Konsultasi Dokter',
                'amount' => 75000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
