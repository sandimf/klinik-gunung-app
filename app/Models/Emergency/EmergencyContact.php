<?php

namespace App\Models\Emergency;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmergencyContact extends Model
{
    use HasFactory;

    protected $table = 'emergency_contact';

    protected $fillable = [
        'name',
        'contact',
    ];
}
