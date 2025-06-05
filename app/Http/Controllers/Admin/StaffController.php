<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Users\Admin;
use App\Models\Users\Doctor;
use App\Models\Users\Cashier;
use App\Models\Users\Manager;
use App\Models\Users\Paramedis;
use App\Models\Users\Warehouse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StaffRequest;
use Illuminate\Support\Facades\Hash;
use App\Jobs\SendStaffCredentialsEmail;
use App\Http\Requests\Clinic\MedicalPersonnelRequest;

class StaffController extends Controller
{
    public function index()
    {
        $doctors = collect(Doctor::with('user')->get()->map(function ($doctor) {
            return [
                'uuid' => $doctor->uuid,
                'id' => $doctor->id,
                'nik' => $doctor->nik,
                'role' => $doctor->role,
                'user_id' => $doctor->user_id,
                'name' => $doctor->name,
                'email' => $doctor->user->email,
                'address' => $doctor->address,
                'date_of_birth' => $doctor->date_of_birth,
                'phone' => $doctor->phone,
                'created_at' => $doctor->created_at,
                'updated_at' => $doctor->updated_at,
            ];
        }));

        $cashiers = collect(Cashier::with('user')->get()->map(function ($cashier) {
            return [
                'uuid' => $cashier->uuid,
                'id' => $cashier->id,
                'nik' => $cashier->nik,
                'role' => $cashier->role,
                'user_id' => $cashier->user_id,
                'name' => $cashier->name,
                'email' => $cashier->user->email,
                'address' => $cashier->address,
                'date_of_birth' => $cashier->date_of_birth,
                'phone' => $cashier->phone,
                'created_at' => $cashier->created_at,
                'updated_at' => $cashier->updated_at,
            ];
        }));

        $paramedis = collect(Paramedis::with('user')->get()->map(function ($paramedi) {
            return [
                'uuid' => $paramedi->uuid,
                'id' => $paramedi->id,
                'nik' => $paramedi->nik,
                'role' => $paramedi->role,
                'user_id' => $paramedi->user_id,
                'name' => $paramedi->name,
                'email' => $paramedi->user->email,
                'address' => $paramedi->address,
                'date_of_birth' => $paramedi->date_of_birth,
                'phone' => $paramedi->phone,
                'created_at' => $paramedi->created_at,
                'updated_at' => $paramedi->updated_at,
            ];
        }));

        $admins = collect(Admin::with('user')->get()->map(function ($admin) {
            return [
                'uuid' => $admin->uuid,
                'id' => $admin->id,
                'nik' => $admin->nik,
                'role' => $admin->role,
                'user_id' => $admin->user_id,
                'name' => $admin->name,
                'email' => $admin->user->email,
                'address' => $admin->address,
                'date_of_birth' => $admin->date_of_birth,
                'phone' => $admin->phone,
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at,
            ];
        }));
        $warehouse = collect(Warehouse::with('user')->get()->map(function ($warehouse) {
            return [
                'uuid' => $warehouse->uuid,
                'id' => $warehouse->id,
                'nik' => $warehouse->nik,
                'role' => $warehouse->role,
                'user_id' => $warehouse->user_id,
                'name' => $warehouse->name,
                'email' => $warehouse->user->email,
                'address' => $warehouse->address,
                'date_of_birth' => $warehouse->date_of_birth,
                'phone' => $warehouse->phone,
                'created_at' => $warehouse->created_at,
                'updated_at' => $warehouse->updated_at,
            ];
        }));


        // Merge the collections of doctors, cashiers, paramedis, and admins
        $users = $doctors->merge($cashiers)->merge($paramedis)->merge($admins)->merge($warehouse);

        // Pass the merged users data to the Inertia view
        return Inertia::render('Dashboard/Admin/MedicalPersonnel/Index', [
            'users' => $users,
        ]);
    }

    // Form untuk menampilkan penambahan tenaga medis
    public function create()
    {
        return Inertia::render('Dashboard/Admin/MedicalPersonnel/New');
    }

    // Membuat tenaga medis baru
    public function store(StaffRequest $request)
    {
        // Mulai transaksi database
        DB::beginTransaction();

        // Simpan password asli sebelum di-hash
        $plainPassword = $request->password;

        // Buat pengguna baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($plainPassword), // Hash password
            'email_verified_at' => now(),
            'role' => $request->role,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Siapkan data untuk jenis medical personnel
        $medicalPersonnelData = [
            'user_id' => $user->id,
            'nik' => $request->nik,
            'email' => $request->email,
            'name' => $request->name,
            'address' => $request->address,
            'date_of_birth' => $request->date_of_birth,
            'phone' => $request->phone,
        ];

        // Peta kelas berdasarkan role
        $classMap = [
            'doctor' => Doctor::class,
            'paramedis' => Paramedis::class,
            'cashier' => Cashier::class,
            'admin' => Admin::class,
            'warehouse' => Warehouse::class,
            'manager' => Manager::class,
        ];

        // Cek dan simpan data berdasarkan role
        if (! array_key_exists($request->role, $classMap)) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Invalid role provided.');
        }

        // Simpan data medical personnel
        $classMap[$request->role]::create($medicalPersonnelData);

        // Dispatch Job untuk mengirim email
        SendStaffCredentialsEmail::dispatch($user, $plainPassword);

        // Commit transaksi
        DB::commit();

        return redirect()->back()->with('message', 'User  added successfully.');
    }
}
