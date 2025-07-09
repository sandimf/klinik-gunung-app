<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ScreeningOfflineQuestionsSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'label' => 'Tanggal Rencana Pendakian',
                'type' => 'date',
            ],
            [
                'label' => 'Jumlah Pendakian Sebelumnya (di atas 2.000 mdpl)',
                'type' => 'text',
            ],
            [
                'label' => 'Apakah Anda memiliki riwayat penyakit berikut ini?',
                'type' => 'checkbox',
                'options' => [
                    'Penyakit jantung',
                    'Asma',
                    'Hipertensi (tekanan darah tinggi)',
                    'Hipotensi (tekanan darah rendah)',
                    'Diabetes',
                    'Masalah paru-paru lainnya',
                    'Cedera sendi/lutut/pergelangan kaki',
                    'Tidak ada dari yang disebutkan',
                ],
            ],
            [
                'label' => 'Kapan terakhir kali Anda melakukan pemeriksaan kesehatan umum?',
                'type' => 'select',
                'options' => [
                    'Kurang dari 6 bulan yang lalu',
                    '6 bulan - 1 tahun yang lalu',
                    'Lebih dari 1 tahun yang lalu',
                    'Belum pernah melakukan',
                ],
            ],
            [
                'label' => 'Apakah Anda memiliki masalah dengan:',
                'type' => 'checkbox',
                'options' => [
                    'Pernapasan saat berolahraga berat',
                    'Daya tahan tubuh saat melakukan aktivitas fisik',
                    'Tidak ada masalah di atas',
                ],
            ],
            [
                'label' => 'Apakah Anda sedang dalam pengobatan rutin atau menggunakan obat tertentu? Jika ya, sebutkan:',
                'type' => 'checkbox_textarea',
                'options' => [
                    'Ya',
                    'Tidak',
                ],
            ],
            [
                'label' => 'Bagaimana Anda menilai kondisi fisik Anda saat ini untuk pendakian (misal: kekuatan otot, keseimbangan, stamina)?',
                'type' => 'select',
                'options' => [
                    'Sangat baik',
                    'Baik',
                    'Cukup',
                    'Buruk',
                ],
            ],
            [
                'label' => 'Apakah Anda memiliki alergi (terhadap makanan, obat, atau lainnya)? jika Ya, sebutkan:',
                'type' => 'checkbox_textarea',
                'options' => ['Ya', 'Tidak'],
            ],

        ];

        foreach ($questions as $q) {
            DB::table('screening_offline_questions')->insert([
                'question_text' => $q['label'],
                'answer_type' => $q['type'],
                'options' => isset($q['options']) ? json_encode($q['options']) : null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
