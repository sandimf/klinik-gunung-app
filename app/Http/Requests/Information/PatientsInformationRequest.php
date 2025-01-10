<?php

namespace App\Http\Requests\Information;

use Illuminate\Foundation\Http\FormRequest;

class PatientsInformationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nik' => 'required|string|unique:patients,nik|max:16',
            'name' => 'required|string|max:255',
            'place_of_birth' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'rt_rw' => 'required|string|max:10',
            'address' => 'required|string|max:255',
            'village' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'religion' => 'required|string|max:50',
            'marital_status' => 'required|string|max:50',
            'occupation' => 'required|string|max:255',
            'nationality' => 'required|string|max:50',
            'gender' => 'required|in:male,female,other',
            'email' => 'required|email|unique:patients,email|max:255',
            'age' => 'required|integer|min:0',
            'blood_type' => 'required|string|max:10',
            'contact' => 'required|string|unique:patients,contact|max:15',
            'ktp_images' => 'nullable|string|max:255',
            'screening_status' => 'nullable|in:completed,pending,cancelled',
            'health_status' => 'nullable|in:pending,healthy,sick,under treatment',
            'health_check_status' => 'nullable|in:pending,completed',
            'payment_status' => 'nullable|in:completed,pending,cancelled',
        ];
    }
}
