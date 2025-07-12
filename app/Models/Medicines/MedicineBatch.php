<?php

namespace App\Models\Medicines;

use App\Models\Payments;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicineBatch extends Model
{
    use HasFactory;

    protected $table = 'medicine_batches';

    protected $fillable = ['medicine_id', 'batch_number', 'quantity', 'expiration_date', 'supplier'];

    protected $dates = ['expiration_date'];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function payments()
    {
        return $this->hasMany(Payments::class, 'medicine_batch_id');
    }

    public function deductStock($quantity)
    {
        if ($this->quantity >= $quantity) {
            $this->quantity -= $quantity;
            $this->save();
            return true;
        }
        return false;
    }
}
