<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class EmergencyRequest extends FormRequest
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
            'contact' => [
                'required',
                'string',
                'regex:/^(\+62|62|0)[0-9]{8,13}$/',
                'min:10',
                'max:15',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi',
            'contact.required' => 'Nomor Kontak wajib diisi',
            'contact.regex' => 'Format nomor telepon tidak valid. Gunakan format: +62xxx, 62xxx, atau 0xxx',
            'contact.min' => 'Nomor telepon minimal 10 digit',
            'contact.max' => 'Nomor telepon maksimal 15 digit',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Membersihkan nomor telepon dari spasi, tanda hubung, dan karakter non-numerik lainnya
        // kecuali tanda + di awal
        if ($this->has('contact')) {
            $contact = $this->input('contact');

            // Hapus spasi, tanda hubung, dan karakter non-numerik kecuali + di awal
            $contact = preg_replace('/[^\d+]/', '', $contact);

            // Jika dimulai dengan +, pastikan hanya ada satu + di awal
            if (str_starts_with($contact, '+')) {
                $contact = '+'.preg_replace('/[^\d]/', '', substr($contact, 1));
            }

            $this->merge([
                'contact' => $contact,
            ]);
        }
    }
}
