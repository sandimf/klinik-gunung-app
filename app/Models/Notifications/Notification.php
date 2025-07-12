<?php

namespace App\Models\Notifications;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\DatabaseNotification;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    /**
     * Get the user that owns the notification.
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    /**
     * Scope a query to only include unread notifications.
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    /**
     * Scope a query to only include read notifications.
     */
    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    /**
     * Mark the notification as read.
     */
    public function markAsRead()
    {
        $this->update(['read_at' => now()]);
    }

    /**
     * Mark the notification as unread.
     */
    public function markAsUnread()
    {
        $this->update(['read_at' => null]);
    }

    /**
     * Check if the notification is read.
     */
    public function isRead()
    {
        return !is_null($this->read_at);
    }

    /**
     * Check if the notification is unread.
     */
    public function isUnread()
    {
        return is_null($this->read_at);
    }
} 