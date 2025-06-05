<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StaffRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,cashier,paramedis,doctor,manager,warehouse,manager',
            'nik' => 'required|string|unique:doctors,nik|unique:paramedis,nik|unique:cashiers,nik|unique:patients,nik|unique:admins,nik|unique:warehouses,nik',
            'date_of_birth' => 'required|date',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:15|min:5|unique:admins,phone|unique:paramedis,phone|unique:cashiers,phone|unique:doctors,phone|unique:patients,contact',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama tidak boleh kosong',
            'name.string' => 'Nama harus berupa string',
            'name.max' => 'Nama maksimal 255 karakter',
            'date_of_birth.required' => 'Tanggal lahir wajib di isi',
            'address' => 'Alamat tidak boleh kosong',
            'phone' => 'Nomor telepon tidak boleh kosong',
            'email.required' => 'Email tidak boleh kosong',
            'email.string' => 'Email harus berupa string',
            'role.required' => 'Peran wajin di isi',
        ];
    }
}
