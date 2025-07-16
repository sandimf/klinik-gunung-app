<?php

namespace App\Services\Admin;

use App\Exceptions\NikExistsException;
use App\Jobs\SendStaffCredentialsEmail;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Cashier;
use App\Models\Users\Doctor;
use App\Models\Users\Manager;
use App\Models\Users\Paramedis;
use App\Models\Users\Warehouse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class StaffCreationService
{
    /**
     * @var array<string, class-string>
     */
    protected array $classMap = [
        'doctor' => Doctor::class,
        'paramedis' => Paramedis::class,
        'cashier' => Cashier::class,
        'admin' => Admin::class,
        'warehouse' => Warehouse::class,
        'manager' => Manager::class,
    ];

    /**
     * Menangani logika kompleks pembuatan anggota staf baru.
     *
     * @param  array  $data  Data yang tervalidasi dari request.
     *
     * @throws NikExistsException Jika NIK sudah ada di peran lain.
     */
    public function createStaff(array $data): void
    {
        $role = $data['role'];

        // 1. LOGIKA KOMPLEKS: Validasi NIK unik di SEMUA tabel peran.
        // Ini adalah aturan bisnis penting yang tidak ada di controller asli.
        $this->ensureNikIsUniqueAcrossAllRoles($data['nik']);

        DB::transaction(function () use ($data, $role) {
            $plainPassword = $data['password'];

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($plainPassword),
                'email_verified_at' => now(),
                'role' => $role,
            ]);

            $personnelData = [
                'user_id' => $user->id,
                'nik' => $data['nik'],
                'email' => $data['email'],
                'name' => $data['name'],
                'address' => $data['address'],
                'date_of_birth' => $data['date_of_birth'],
                'phone' => $data['phone'],
                'role' => $role, // Memastikan konsistensi data
                'signature' => $data['signature'] ?? null, // <--- Tambahkan ini
            ];

            Log::info($personnelData); // cek isi sebelum create
            $this->classMap[$role]::create($personnelData);

            // 2. LOGIKA KOMPLEKS: Proses background untuk mengirim email.
            // Memisahkan pengiriman email agar tidak memblokir response.
            SendStaffCredentialsEmail::dispatch($user, $plainPassword);

            Log::info('Anggota staf baru berhasil dibuat.', ['user_id' => $user->id, 'role' => $role]);
        });
    }

    /**
     * @throws NikExistsException
     */
    protected function ensureNikIsUniqueAcrossAllRoles(string $nik): void
    {
        foreach ($this->classMap as $role => $class) {
            if ($class::where('nik', $nik)->exists()) {
                throw new NikExistsException("NIK '{$nik}' sudah terdaftar sebagai {$role}.");
            }
        }
    }
}
