<?php

namespace App\Models\Medicines;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicinePricing extends Model
{
    use HasFactory;

    protected $table = 'medicine_pricings';

    protected $fillable = ['medicine_id', 'purchase_price', 'otc_price'];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function batches()
    {
        return $this->hasMany(MedicineBatch::class);
    }

    // Relasi ke pricing obat
    public function pricing()
    {
        return $this->hasOne(MedicinePricing::class);
    }
}
