<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ScreeningOnlineQuestionsSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'label' => 'Tanggal Rencana Pendakian',
                'type' => 'date',
            ],
            [
                'label' => 'Jumlah Pendakian Sebelumnya (di atas 2.000 meter)',
                'type' => 'number',
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
            [
                'label' => 'Apakah Anda pernah mendaki Gunung Semeru sebelumnya?',
                'type' => 'select',
                'options' => ['Ya', 'Tidak'],
            ],
            [
                'label' => 'Apakah Anda pernah mengalami "Altitude Sickness" (mabuk ketinggian)?',
                'type' => 'select',
                'options' => ['Ya', 'Tidak'],
            ],
            [
                'label' => 'Apakah Anda mengetahui cara menangani situasi darurat seperti hipotermia, dehidrasi, atau cedera selama pendakian?',
                'type' => 'select',
                'options' => ['Ya', 'Tidak'],
            ],
            [
                'label' => 'Apakah Anda membawa atau tahu cara menggunakan perlengkapan berikut?',
                'type' => 'checkbox',
                'options' => [
                    'Peta dan kompas/GPS',
                    'Pisau multi-fungsi',
                    'Kit pertolongan pertama',
                    'Lampu senter/headlamp',
                    'Tidak membawa atau tidak tahu cara menggunakannya',
                ],
            ],
            [
                'label' => 'Bagaimana persiapan Anda menghadapi perubahan cuaca di Gunung Semeru?',
                'type' => 'checkbox',
                'options' => [
                    'Membawa pakaian waterproof dan windproof',
                    'Membawa pakaian berlapis untuk ketinggian',
                    'Membawa jas hujan atau ponco',
                    'Tidak tahu apa yang harus dibawa',
                ],
            ],
        ];

        foreach ($questions as $q) {
            DB::table('screening_Online_questions')->insert([
                'question_text' => $q['label'],
                'answer_type' => $q['type'],
                'options' => isset($q['options']) ? json_encode($q['options']) : null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
