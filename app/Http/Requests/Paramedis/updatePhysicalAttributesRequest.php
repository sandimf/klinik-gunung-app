<?php

namespace App\Http\Requests\Paramedis;

use Illuminate\Foundation\Http\FormRequest;

class updatePhysicalAttributesRequest extends FormRequest
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
            'tinggi_badan' => 'nullable|numeric|min:1|max:999.99',
            'berat_badan' => 'nullable|numeric|min:1|max:999.99',
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
            'tinggi_badan.numeric' => 'Tinggi badan harus berupa angka (boleh desimal, cm).',
            'tinggi_badan.min' => 'Tinggi badan minimal 1 cm.',
            'tinggi_badan.max' => 'Tinggi badan maksimal 999.99 cm.',
            'berat_badan.numeric' => 'Berat badan harus berupa angka (boleh desimal, kg).',
            'berat_badan.min' => 'Berat badan minimal 1 kg.',
            'berat_badan.max' => 'Berat badan maksimal 999.99 kg.',
        ];
    }
}
