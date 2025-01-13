<?php


namespace App\Repositories;

use App\Models\User;
use App\Models\Activity\UserVisit;
use Illuminate\Support\Facades\Auth;

class VisitRepository

{
    // query visit count
    public function visitCount(User $user)
    {
        if (Auth::check()) {
            // Check if today's visit is already logged
            $todayVisit = UserVisit::where('user_id', $user->id)
                ->whereDate('visit_date', now()->toDateString())
                ->first();
    
            // If not logged, create a new visit entry for today
            if (!$todayVisit) {
                UserVisit::create([
                    'user_id' => $user->id,
                    'visit_date' => now(),
                ]);
            }
        }
    
        // Count the user's visits in the last 3 months
        return UserVisit::where('user_id', $user->id)
            ->where('visit_date', '>=', now()->subMonths(3))
            ->count();
    }
}
