<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;

class SocialLogin extends Model
{
    protected $table = "social_login";

    protected $fillable = ['google'];
}
