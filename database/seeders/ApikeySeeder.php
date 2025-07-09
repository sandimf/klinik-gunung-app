<?php

namespace Database\Seeders;

use App\Models\Ai\Apikey;
use Illuminate\Database\Seeder;

class ApikeySeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 0; $i < 1; $i++) {
            Apikey::create([
                'api_key' => 'AIzaSyCLC_Hl39mAg5gHUL16pg1FLo2uvBUcEEU',
            ]);
        }
    }
}
