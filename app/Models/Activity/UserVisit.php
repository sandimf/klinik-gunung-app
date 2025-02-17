<?php

namespace App\Models\Activity;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserVisit extends Model
{
    use HasFactory;

    protected $table = 'user_visits';

    protected $fillable = ['user_id', 'visit_date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
