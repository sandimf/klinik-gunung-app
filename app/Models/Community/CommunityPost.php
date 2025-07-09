<?php

namespace App\Models\Community;

use Illuminate\Database\Eloquent\Model;

class CommunityPost extends Model
{
    protected $table = 'community_posts';

    protected $fillable = [
        'content',
        'image',
        'status',
        'community_id',
    ];

    /**
     * A post belongs to a community profile.
     */
    public function community()
    {
        return $this->belongsTo(Community::class);
    }
}
