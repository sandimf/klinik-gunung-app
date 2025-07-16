<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Cashier;
use App\Models\Users\Doctor;
use App\Models\Users\Paramedis;
use App\Models\Users\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'doctor', 'cashier', 'paramedis', 'warehouse'];

        foreach ($roles as $role) {
            // Buat user dengan role yang berbeda
            $user = User::create([
                'name' => ucfirst($role).' User '.rand(1, 100),
                'email' => $role.'@example.com',
                'email_verified_at' => Carbon::now(),
                'role' => $role,
                'password' => Hash::make('password'),
                'remember_token' => Str::random(60),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // Masukkan user ke tabel sesuai dengan role
            switch ($role) {
                case 'admin':
                    Admin::create([
                        'user_id' => $user->id,
                        'nik' => str_pad(random_int(1, 9999999999999999), 16, '0', STR_PAD_LEFT),
                        'role' => $role,
                        'email' => $role.'@example.com',
                        'name' => $user->name,
                        'address' => 'Address for '.$role,
                        'date_of_birth' => Carbon::now()->subYears(rand(20, 40)),
                        'phone' => '08'.rand(100000000, 999999999),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                    break;

                case 'doctor':
                    Doctor::create([
                        'user_id' => $user->id,
                        'nik' => str_pad(random_int(1, 9999999999999999), 16, '0', STR_PAD_LEFT),
                        'role' => $role,
                        'email' => $role.'@example.com',
                        'name' => $user->name,
                        'address' => 'Address for '.$role,
                        'date_of_birth' => Carbon::now()->subYears(rand(25, 50)),
                        'phone' => '08'.rand(100000000, 999999999),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                    break;

                case 'cashier':
                    Cashier::create([
                        'user_id' => $user->id,
                        'nik' => str_pad(random_int(1, 9999999999999999), 16, '0', STR_PAD_LEFT),
                        'role' => $role,
                        'email' => $role.'@example.com',
                        'name' => $user->name,
                        'address' => 'Address for '.$role,
                        'date_of_birth' => Carbon::now()->subYears(rand(20, 35)),
                        'phone' => '08'.rand(100000000, 999999999),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                    break;

                case 'paramedis':
                    Paramedis::create([
                        'user_id' => $user->id,
                        'nik' => str_pad(random_int(1, 9999999999999999), 16, '0', STR_PAD_LEFT),
                        'role' => $role,
                        'email' => $role.'@example.com',
                        'name' => $user->name,
                        'address' => 'Address for '.$role,
                        'date_of_birth' => Carbon::now()->subYears(rand(22, 40)),
                        'phone' => '08'.rand(100000000, 999999999),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                    break;

                case 'warehouse':
                    Warehouse::create([
                        'user_id' => $user->id,
                        'nik' => str_pad(random_int(1, 9999999999999999), 16, '0', STR_PAD_LEFT),
                        'role' => $role,
                        'email' => $role.'@example.com',
                        'name' => $user->name,
                        'address' => 'Address for '.$role,
                        'date_of_birth' => Carbon::now()->subYears(rand(20, 50)),
                        'phone' => '08'.rand(100000000, 999999999),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                    break;
            }
        }

        // $this->call(FullStressTestSeeder::class);
        $this->call(ScreeningOfflineQuestionsSeeder::class);
        $this->call([
            ApikeySeeder::class,
            AmountScreeningSeeder::class,
        ]);
        // $this->call(MedicineSeeder::class);
        $this->call(ScreeningStressTestSeeder::class);

    }
}
