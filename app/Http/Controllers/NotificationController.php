<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Screenings\Screening;
use App\Models\Notifications\Notification as NotificationModel;

class NotificationController extends Controller
{
    /**
     * Get notifications for authenticated paramedic
     */
    public function getNotifications()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Not authenticated'], 401);
            }
            
            if ($user->role !== 'paramedis') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $notifications = NotificationModel::where('user_id', $user->id)
                ->where('read_at', null)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $notifications->count()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|exists:notifications,id'
        ]);

        $notification = NotificationModel::findOrFail($request->notification_id);
        
        // Check if user owns this notification
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        NotificationModel::where('user_id', Auth::id())
            ->where('read_at', null)
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    /**
     * Get unread count for realtime updates
     */
    public function getUnreadCount()
    {
        $count = NotificationModel::where('user_id', Auth::id())
            ->where('read_at', null)
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    /**
     * Get recent screenings for paramedic
     */
    public function getRecentScreenings()
    {
        $user = Auth::user();
        
        if ($user->role !== 'paramedis') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $screenings = Screening::where('paramedic_id', $user->id)
            ->with(['patient:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json(['screenings' => $screenings]);
    }
} 