<?php

namespace App\Http\Requests\Screenings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ScreeningOfflineRequest extends FormRequest
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
        $userId = optional(Auth::user())->id; // Dapatkan ID pengguna yang sedang login

        return [
            'nik' => [
                'required',
                'string',
                'max:16',
                Rule::unique('patients', 'nik')->ignore($userId, 'user_id'), // Abaikan jika pasien sudah terhubung dengan pengguna
            ],
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'contact' => [
                'required',
                'string',
                'numeric',
                Rule::unique('patients', 'contact')->ignore($userId, 'user_id'),
            ],
            'gender' => 'required|string',
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('patients', 'email')->ignore($userId, 'user_id'),
            ],
            'answers' => 'required|array',
            'answers.*.questioner_id' => 'required|exists:screening_offline_questions,id',
            'answers.*.answer' => 'required',
        ];
    }
}
