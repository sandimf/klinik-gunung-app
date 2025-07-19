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
      'type.required' => 'Silakan isi jenis pelayanan.',
      'type.string' => 'Jenis pelayanan harus berupa teks yang valid.',
      'type.unique' => 'Jenis pelayanan ini sudah terdaftar sebelumnya.',
      'amount.required' => 'Silakan isi nominal harga.',
      'amount.numeric' => 'Nominal harga harus berupa angka.',
      'amount.min' => 'Nominal harga tidak boleh kurang dari 0.',
    ];
  }

}
