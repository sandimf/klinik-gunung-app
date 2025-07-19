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
      'nik.required' => 'Silakan isi NIK.',
      'nik.numeric' => 'NIK harus berupa angka.',

      'name.required' => 'Silakan isi nama lengkap.',
      'name.string' => 'Nama harus berupa teks yang valid.',
      'name.max' => 'Nama tidak boleh melebihi 255 karakter.',

      'place_of_birth.required' => 'Silakan isi tempat lahir.',
      'place_of_birth.string' => 'Tempat lahir harus berupa teks.',
      'place_of_birth.max' => 'Tempat lahir tidak boleh melebihi 255 karakter.',

      'date_of_birth.required' => 'Silakan isi tanggal lahir.',
      'date_of_birth.string' => 'Format tanggal lahir tidak valid.',

      'rt_rw.required' => 'Silakan isi RT/RW.',
      'address.required' => 'Silakan isi alamat lengkap.',
      'village.required' => 'Silakan isi kelurahan atau desa.',
      'district.required' => 'Silakan isi kecamatan.',
      'religion.required' => 'Silakan pilih agama.',
      'marital_status.required' => 'Silakan pilih status perkawinan.',
      'occupation.required' => 'Silakan isi pekerjaan.',
      'nationality.required' => 'Silakan isi kewarganegaraan.',

      'gender.required' => 'Silakan pilih jenis kelamin.',
      'gender.max' => 'Jenis kelamin tidak boleh melebihi 10 karakter.',

      'blood_type.required' => 'Silakan pilih golongan darah.',

      'email.required' => 'Silakan isi alamat email.',
      'email.email' => 'Format email tidak valid.',
      'email.max' => 'Email tidak boleh melebihi 255 karakter.',
      'email.unique' => 'Email ini sudah digunakan sebelumnya.',

      'age.required' => 'Silakan isi umur.',
      'age.integer' => 'Umur harus berupa angka.',

      'contact.required' => 'Silakan isi nomor kontak.',
      'contact.string' => 'Nomor kontak harus berupa teks.',
      'contact.max' => 'Nomor kontak tidak boleh melebihi 15 karakter.',

      'ktp_images.file' => 'File KTP harus berupa dokumen yang sah.',
      'ktp_images.mimes' => 'Format file KTP harus berupa jpg, jpeg, atau png.',
      'ktp_images.max' => 'Ukuran file KTP tidak boleh melebihi 10MB.',

      'answers.required' => 'Silakan isi jawaban screening.',
      'answers.array' => 'Format jawaban screening tidak valid.',
      'answers.*.questioner_id.required' => 'Pertanyaan belum dipilih.',
      'answers.*.questioner_id.exists' => 'Pertanyaan tidak ditemukan.',
      'answers.*.answer.required' => 'Silakan isi jawaban untuk setiap pertanyaan.',
    ];
  }
}
