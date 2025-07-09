<?php

namespace Database\Seeders;

use App\Models\Roles\Admin\Management\AmountScreening;
use Illuminate\Database\Seeder;

class AmountScreeningSeeder extends Seeder
{
    public function run(): void
    {
        AmountScreening::create([
            'type' => 'offline',
            'amount' => 25000,
        ]);
        AmountScreening::create([
            'type' => 'online',
            'amount' => 35000,
        ]);
    }
}
