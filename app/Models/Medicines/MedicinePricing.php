<?php

namespace App\Models\Medicines;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicinePricing extends Model
{
    use HasFactory;

    protected $table = 'medicine_pricings';

    protected $fillable = ['medicine_id', 'purchase_price', 'otc_price', 'unit_type'];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}
