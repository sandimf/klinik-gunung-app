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
        // Validasi Formulir Pasien
        return [
            'nik' => 'required|string|unique:patients,nik|max:16|min:16',
            'name' => 'required|string|max:255',
            'place_of_birth' => 'required|string|max:255',
            'date_of_birth' => 'required|string|max:25',
            'rt_rw' => 'required|string|max:10',
            'address' => 'required|string|max:255',
            'village' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'religion' => 'required|string|max:50',
            'marital_status' => 'required|string|max:50',
            'occupation' => 'required|string|max:255',
            'nationality' => 'required|string|max:50',
            'gender' => 'required|in:laki-laki,perempuan,lainnya',
            'email' => 'required|email|unique:patients,email|max:255',
            'age' => 'required|integer|min:0',
            'blood_type' => 'required|string|max:10',
            'contact' => 'required|string|unique:patients,contact|max:15',
            'ktp_images' => 'nullable|image|max:2048',
            'screening_status' => 'nullable|in:completed,pending,cancelled',
            'health_status' => 'nullable|in:pending,healthy,sick,under treatment',
            'health_check_status' => 'nullable|in:pending,completed',
            'payment_status' => 'nullable|in:completed,pending,cancelled',
        ];
    }
    public function messages(): array
    {
        return [
            'nik.required' => 'NIK wajib diisi',
            'nik.unique' => 'NIK sudah terdaftar',
            'nik.max' => 'NIK maksimal 16 karakter',
            'name.required' => 'Nama wajib diisi',
            'name.max' => 'Nama maksimal 255 karakter',
            'place_of_birth.required' => 'Tempat lahir wajib diisi',
            'date_of_birth.required' => 'Tanggal lahir wajib diisi',
            'rt_rw.required' => 'RT/RW wajib diisi',
            'address.required' => 'Alamat wajib diisi',
            'village.required' => 'Desa/Kelurahan wajib diisi',
            'district.required' => 'Kecamatan wajib diisi',
            'religion.required' => 'Agama wajib diisi',
            'marital_status.required' => 'Status pernikahan wajib diisi',
            'occupation.required' => 'Pekerjaan wajib diisi',
            'nationality.required' => 'Kewarganegaraan wajib diisi',
            'gender.required' => 'Jenis kelamin wajib diisi',
            'gender.in' => 'Jenis kelamin tidak valid',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'age.required' => 'Umur wajib diisi',
            'age.integer' => 'Umur harus berupa angka',
            'age.min' => 'Umur tidak boleh kurang dari 0',
            'blood_type.required' => 'Golongan darah wajib diisi',
            'contact.required' => 'Nomor telepon wajib diisi',
            'contact.unique' => 'Nomor telepon sudah terdaftar',
            'contact.max' => 'Nomor telepon maksimal 15 karakter',
            'ktp_images.image' => 'File yang diunggah harus berupa gambar.',
            'ktp_images.max' => 'Ukuran gambar maksimal 2MB.',
            'screening_status.in' => 'Status screening tidak valid',
            'health_status.in' => 'Status kesehatan tidak valid',
            'health_check_status.in' => 'Status pemeriksaan tidak valid',
            'payment_status.in' => 'Status pembayaran tidak valid',
        ];
    }
}
