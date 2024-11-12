<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Data user yang akan di-seed
        $userData = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'role' => 'admin',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Paramedis User',
                'email' => 'paramedis@example.com',
                'role' => 'paramedis',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Cashier User',
                'email' => 'cashier@example.com',
                'role' => 'cashier',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Doctor User',
                'email' => 'doctor@example.com',
                'role' => 'doctor',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@example.com',
                'role' => 'manager',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Patient User',
                'email' => 'patient@example.com',
                'role' => 'patients',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Sandi',
                'email' => 'sandimaulanafz@gmail.com',
                'role' => 'patients',
                'password' => Hash::make('password'),
            ],
        ];
        foreach ($userData as $user) {
            User::create($user);
        }
    }
}
