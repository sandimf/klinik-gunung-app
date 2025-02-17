<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Users\Admin;
use App\Models\Users\Cashier;
use App\Models\Users\Doctor;
use App\Models\Users\Paramedis;
use Inertia\Inertia;

class ManagementStaffController extends Controller
{
    // Index Staff Management
    public function index()
    {
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
        return Inertia::render('Dashboard/Admin/Settings/StaffManagement/Index', [
            'users' => $users,
        ]);
    }
}
