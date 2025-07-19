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
        'name' => ucfirst($role) . ' User ' . rand(1, 100),
        'email' => $role . '@example.com',
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
            'email' => $role . '@example.com',
            'name' => $user->name,
            'address' => 'Address for ' . $role,
            'date_of_birth' => Carbon::now()->subYears(rand(20, 40)),
            'phone' => '08' . rand(100000000, 999999999),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
          ]);
          break;

        case 'doctor':
          Doctor::create([
            'user_id' => $user->id,
            'nik' => str_pad(random_int(1, 9999999999999999), 16, '0', STR_PAD_LEFT),
            'role' => $role,
            'email' => $role . '@example.com',
            'name' => $user->name,
            'address' => 'Address for ' . $role,
            'date_of_birth' => Carbon::now()->subYears(rand(25, 50)),
            'phone' => '08' . rand(100000000, 999999999),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
          ]);
          break;

        case 'cashier':
          Cashier::create([
            'user_id' => $user->id,
            'nik' => str_pad(random_int(1, 9999999999999999), 16, '0', STR_PAD_LEFT),
            'role' => $role,
            'email' => $role . '@example.com',
            'name' => $user->name,
            'address' => 'Address for ' . $role,
            'date_of_birth' => Carbon::now()->subYears(rand(20, 35)),
            'phone' => '08' . rand(100000000, 999999999),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
          ]);
          break;

        case 'paramedis':
          Paramedis::create([
            'user_id' => $user->id,
            'nik' => str_pad(random_int(1, 9999999999999999), 16, '0', STR_PAD_LEFT),
            'role' => $role,
            'email' => $role . '@example.com',
            'name' => $user->name,
            'address' => 'Address for ' . $role,
            'date_of_birth' => Carbon::now()->subYears(rand(22, 40)),
            'phone' => '08' . rand(100000000, 999999999),
            'signature' => 'data:image/png;base64,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',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
          ]);
          break;

        case 'warehouse':
          Warehouse::create([
            'user_id' => $user->id,
            'nik' => str_pad(random_int(1, 9999999999999999), 16, '0', STR_PAD_LEFT),
            'role' => $role,
            'email' => $role . '@example.com',
            'name' => $user->name,
            'address' => 'Address for ' . $role,
            'date_of_birth' => Carbon::now()->subYears(rand(20, 50)),
            'phone' => '08' . rand(100000000, 999999999),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
          ]);
          break;
      }
    }

    $this->call(ScreeningOfflineQuestionsSeeder::class);
    $this->call([
      ApikeySeeder::class,
      AmountScreeningSeeder::class,
    ]);
    // $this->call(MedicineSeeder::class);
    // $this->call(ScreeningStressTestSeeder::class);

    $this->call(MedicineSeeder::class);
    $this->call(ProductSeeder::class);
  }
}

