<?php

namespace App\Models\Consultation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BodyPart extends Model
{
    use HasFactory;

    protected $table = 'body_parts';

    protected $fillable = [
        'id',
        'data',
        'name',
    ];
}
