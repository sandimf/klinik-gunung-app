<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GuestScreeningRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nik' => 'required|numeric|unique:patients,nik',
            'name' => 'required|string|max:255',
            'place_of_birth' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'rt_rw' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'village' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'religion' => 'required|string|max:255',
            'marital_status' => 'required|string|max:255',
            'occupation' => 'required|string|max:255',
            'nationality' => 'required|string|max:255',
            'gender' => 'required|string|max:10',
            'blood_type' => 'required|string|max:10',
            'email' => 'required|email|max:255|unique:patients,email',
            'age' => 'required|integer',
            'contact' => 'required|string|max:15|unique:patients,contact',
            'ktp_images' => 'nullable|file|mimes:jpg,jpeg,png|max:10240', // KTP image, optional
            'answers' => 'required|array',
            'answers.*.questioner_id' => 'required|exists:screening_offline_questions,id',
            'answers.*.answer' => 'required',
        ];
    }

}
