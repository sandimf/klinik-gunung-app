<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmergecyContactModel extends Model
{
    protected $table = 'emergency_contacts';

    protected $fillable = [
        'name',
        'contact',
    ];
}
