<?php

namespace App\Models\Roles\Admin\Management;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmountScreening extends Model
{
    use HasFactory;

    protected $table = 'amount_screening';

    protected $fillable = [
        'type',
        'amount',
    ];
}
