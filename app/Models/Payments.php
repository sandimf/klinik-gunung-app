<?php

namespace App\Models;

use App\Models\Users\Patients;
use App\Models\Medicines\MedicineBatch;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payments extends Model
{
    use HasFactory;

    protected $fillable = [
        'cashier_id',
        'patient_id',
        'payment_status',
        'amount_paid',
        'payment_method',
        'quantity_product',
        'price_product',
        'payment_proof',
    ];

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function medicineBatch()
    {
        return $this->belongsTo(MedicineBatch::class, 'medicine_batch_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patients::class);
    }
    // Metode untuk melakukan pengurangan stok obat
    public function processPurchase()
    {
        if ($this->quantity_product && $this->medicineBatch) {
            $this->medicineBatch->decrement('quantity', $this->quantity_product);
        }
    }
}
