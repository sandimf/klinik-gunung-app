<?php

namespace App\Models\Community;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Community extends Model
{
    protected $table = 'community';

    protected $fillable = [
        'bio', 'username', 'user_id', 'slug',
    ];

    public static function boot()
    {
        parent::boot();

        static::saving(function ($community) {
            if (! empty($community->username)) {
                $community->slug = Str::slug($community->username);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Community profile has many posts.
     */
    public function posts()
    {
        return $this->hasMany(CommunityPost::class);
    }
}
