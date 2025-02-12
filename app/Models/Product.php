<?php

namespace App\Models;

use App\Models\Transaction\Transaction;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = ['name', 'price', 'stock'];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'item_id');
    }
}
