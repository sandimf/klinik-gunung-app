<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinic\MedicalPersonnelRequest;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Cashier;
use App\Models\Users\Doctor;
use App\Models\Users\Paramedis;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class MedicalPersonnelController extends Controller
{
    // Halaman daftar tenaga medis
    public function index()
    {
        // Fetch doctors, cashiers, paramedis, and admins with user data, selecting all relevant fields
        $doctors = collect(Doctor::with('user')->get()->map(function ($doctor) {
            return [
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

        // Merge the collections of doctors, cashiers, paramedis, and admins
        $users = $doctors->merge($cashiers)->merge($paramedis)->merge($admins);

        // Pass the merged users data to the Inertia view
        return Inertia::render('Dashboard/Admin/MedicalPersonnel/Index', [
            'users' => $users,
        ]);
    }

    // Form untuk menampilkan penambahan tenaga medis
    public function create()
    {
        return Inertia::render('Dashboard/Admin/MedicalPersonnel/AddPersonnel/Create');
    }

    // Memebuat tenaga medis baru
    public function store(MedicalPersonnelRequest $request)
    {

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => Carbon::now(),
                'role' => $request->role,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // Siapkan data untuk jenis medical personnel
            $data = [
                'user_id' => $user->id,
                'nik' => $request->nik,
                'email' => $request->email,
                'name' => $request->name,
                'address' => $request->address,
                'date_of_birth' => $request->date_of_birth,
                'phone' => $request->phone,
            ];

            // Insert berdasarkan role
            $classMap = [
                'doctor' => Doctor::class,
                'paramedis' => Paramedis::class,
                'cashier' => Cashier::class,
                'admin' => Admin::class,
            ];

            if (array_key_exists($request->role, $classMap)) {
                $classMap[$request->role]::create($data);
            }

            // Commit transaksi
            DB::commit();

            return redirect()->back()->with('success', 'User  added successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Failed to add user: '.$e->getMessage());
        }
    }

    // Manajemen Staff
    public function show() {}
}
