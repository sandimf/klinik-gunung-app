<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ApikeyRequest extends FormRequest
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
      'api_key' => 'required|string|max:255',
    ];
  }

  public function messages(): array
  {
    return [
      'api_key.required' => 'Silakan masukkan API Key.',
      'api_key.string' => 'Format API Key harus berupa teks.',
      'api_key.max' => 'Panjang API Key maksimal adalah 255 karakter.',
    ];
  }

}
