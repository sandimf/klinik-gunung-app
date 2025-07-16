<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentItem extends Model
{
    use HasFactory;

    protected $table = 'payment_items';

    protected $fillable = [
        'payment_id',
        'item_type',
        'item_id',
        'item_name',
        'quantity',
        'price',
        'total',
    ];

    public function payment()
    {
        return $this->belongsTo(Payments::class, 'payment_id');
    }
}
