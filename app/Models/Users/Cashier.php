<?php

namespace App\Models\Users;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cashier extends Model
{
    use HasFactory;

    protected $table = 'cashiers';

    protected $fillable = [
        'user_id',
        'nik',
        'email',
        'name',
        'address',
        'date_of_birth',
        'phone',
        'role',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
