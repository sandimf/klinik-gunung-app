<?php

namespace App\Http\Requests\Medicines;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicineRequest extends FormRequest
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
        $medicineId = $this->route('medicine');

        return [
            'barcode' => 'required|unique:medicines,barcode,'.$medicineId,
            'medicine_name' => 'required|string|max:150',
            'brand_name' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'dosage' => 'required|integer',
            'content' => 'required|string|max:150',
            'purchase_price' => 'required|numeric',
            'otc_price' => 'required|numeric',
            'batch_number' => 'required|string|max:100',
            'quantity' => 'required|integer',
            'expiration_date' => 'required|date',
            'supplier' => 'nullable|string|max:150',
        ];
    }
}
