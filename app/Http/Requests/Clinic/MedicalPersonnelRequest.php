<?php

namespace App\Http\Requests\Clinic;

use Illuminate\Foundation\Http\FormRequest;

class MedicalPersonnelRequest extends FormRequest
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
            'role' => 'required|string|in:admin,cashier,paramedis,doctor,manager',
            'nik' => 'required|string|unique:doctors,nik|unique:paramedis,nik|unique:cashiers,nik',
            'date_of_birth' => 'required_if:role,doctor,paramedis,cashier|date|nullable',
            'address' => 'required|string|max:255',
            'phone' => 'nullable|string|max:15',
        ];
    }
}
