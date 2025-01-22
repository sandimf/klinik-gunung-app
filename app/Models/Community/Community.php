<?php

namespace App\Models\Community;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Community extends Model
{
    protected $table = 'community';

    protected $fillable = [
        'bio', 'username', 'content', 'image', 'status', 'user_id', 'slug',
    ];

    public static function boot()
    {
        parent::boot();

        // Buat atau perbarui slug saat model akan dibuat atau diperbarui
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
}
