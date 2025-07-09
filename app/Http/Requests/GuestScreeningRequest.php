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
            'nik' => 'required|numeric|digits_between:1,16',
            'name' => 'required|string|max:255',
            'place_of_birth' => 'required|string|max:255',
            'date_of_birth' => 'required|string|max:255',
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
            'tinggi_badan' => 'required|numeric|min:1',
            'berat_badan' => 'required|numeric|min:1',
            'email' => 'required|email|max:255|unique:patients,email',
            'age' => 'required|integer',
            'contact' => 'required|string|max:15',
            'ktp_images' => 'nullable|file|mimes:jpg,jpeg,png|max:10240', // KTP image, optional
            'answers' => 'required|array',
            'answers.*.questioner_id' => 'required|exists:screening_offline_questions,id',
            'answers.*.answer' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'nik.required' => 'NIK wajib diisi.',
            'nik.numeric' => 'NIK harus berupa angka.',

            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',

            'place_of_birth.required' => 'Tempat lahir wajib diisi.',
            'place_of_birth.string' => 'Tempat lahir harus berupa teks.',
            'place_of_birth.max' => 'Tempat lahir tidak boleh lebih dari 255 karakter.',

            'date_of_birth.required' => 'Tanggal lahir wajib diisi.',
            'date_of_birth.string' => 'Format tanggal lahir tidak valid.',

            'rt_rw.required' => 'RT/RW wajib diisi.',
            'address.required' => 'Alamat wajib diisi.',
            'village.required' => 'Kelurahan/Desa wajib diisi.',
            'district.required' => 'Kecamatan wajib diisi.',
            'religion.required' => 'Agama wajib diisi.',
            'marital_status.required' => 'Status perkawinan wajib diisi.',
            'occupation.required' => 'Pekerjaan wajib diisi.',
            'nationality.required' => 'Kewarganegaraan wajib diisi.',

            'gender.required' => 'Jenis kelamin wajib diisi.',
            'gender.max' => 'Jenis kelamin tidak boleh lebih dari 10 karakter.',

            'blood_type.required' => 'Golongan darah wajib diisi.',

            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email tidak boleh lebih dari 255 karakter.',
            'email.unique' => 'Email sudah digunakan.',

            'age.required' => 'Umur wajib diisi.',
            'age.integer' => 'Umur harus berupa angka.',

            'contact.required' => 'Nomor kontak wajib diisi.',
            'contact.string' => 'Nomor kontak harus berupa teks.',
            'contact.max' => 'Nomor kontak tidak boleh lebih dari 15 karakter.',

            'ktp_images.file' => 'File KTP harus berupa file.',
            'ktp_images.mimes' => 'Format file KTP harus jpg, jpeg, atau png.',
            'ktp_images.max' => 'Ukuran file KTP tidak boleh lebih dari 10MB.',

            'answers.required' => 'Jawaban screening wajib diisi.',
            'answers.array' => 'Format jawaban tidak valid.',
            'answers.*.questioner_id.required' => 'Pertanyaan wajib diisi.',
            'answers.*.questioner_id.exists' => 'Pertanyaan tidak valid.',
            'answers.*.answer.required' => 'Jawaban wajib diisi.',
        ];
    }
}
