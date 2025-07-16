<?php

namespace App\Http\Requests\Paramedis;

use Illuminate\Foundation\Http\FormRequest;

class EditKuesionerRequest extends FormRequest
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
            'answer' => 'required|string',
            'question_id' => 'required|integer|exists:questions,id',
            'patient_id' => 'required|integer|exists:patients,id',
            'queue' => 'nullable|integer|min:1',
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
            'answer.required' => 'Jawaban wajib diisi untuk kelengkapan data pemeriksaan.',
            'answer.string' => 'Jawaban harus berupa teks yang valid.',
            'question_id.required' => 'Pertanyaan wajib dipilih.',
            'question_id.integer' => 'ID pertanyaan tidak valid.',
            'question_id.exists' => 'Pertanyaan yang dipilih tidak ditemukan dalam sistem.',
            'patient_id.required' => 'Data pasien wajib diisi.',
            'patient_id.integer' => 'ID pasien tidak valid.',
            'patient_id.exists' => 'Pasien yang dipilih tidak ditemukan dalam sistem.',
            'queue.integer' => 'Nomor urut harus berupa angka.',
            'queue.min' => 'Nomor urut minimal bernilai 1.',
        ];
    }
}
