<?php

namespace App\Http\Requests\Cashier;

use Illuminate\Foundation\Http\FormRequest;

class ScreeningPaymentsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Update this with proper authorization logic if needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cashier_id' => 'required|exists:cashiers,id',
            'patient_id' => 'required|exists:patients,id',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'quantity_product' => 'nullable|integer|min:1',
            'payment_proof' => 'nullable|file|image|max:2048',
            'selected_medicine_id' => 'nullable|exists:medicines,id',
            'medicine_batch_id' => 'nullable|exists:medicine_batches,id',
            'selectedOptions' => 'nullable|array',
            'medicine_quantity' => 'nullable|integer|min:1',
            // Validasi produk
            'selected_products' => 'nullable|array',
            'selected_products.*.product_id' => 'required_with:selected_products|exists:products,id',
            'selected_products.*.quantity' => 'required_with:selected_products|integer|min:1',
        ];
    }
}
