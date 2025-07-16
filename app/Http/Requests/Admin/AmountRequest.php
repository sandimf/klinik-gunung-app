<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AmountRequest extends FormRequest
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
            'type' => 'required|string|unique:amount_screening,type',
            'amount' => 'required|numeric|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Jenis Pelayanan wajib diisi.',
            'type.string' => 'Jenis Pelayanan harus berupa teks.',
            'type.unique' => 'Jenis Pelayanan sudah terdaftar.',
            'amount.required' => 'Harga wajib diisi.',
            'amount.numeric' => 'Harga harus berupa angka.',
            'amount.min' => 'Harga minimal 0.',
        ];
    }
}
