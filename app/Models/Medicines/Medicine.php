<?php

namespace App\Models\Medicines;

use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $table = 'medicines';

    protected $fillable = [
        'barcode', 'medicine_name', 'brand_name', 'category', 'dosage', 'content', 'quantity',
    ];

    public function pricing()
    {
        return $this->hasOne(MedicinePricing::class);
    }

    public function batches()
    {
        return $this->hasMany(MedicineBatch::class);
    }

    public function patients()
    {
        return $this->belongsToMany(Patients::class, 'medicine_patient', 'medicine_id', 'patient_id')
            ->withPivot('quantity');
    }

    public function deductStock($quantity)
    {
        $this->quantity -= $quantity;
        $this->save();
    }
}
