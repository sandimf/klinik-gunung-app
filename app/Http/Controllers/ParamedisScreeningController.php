<?php

namespace App\Http\Controllers;

use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParamedisScreeningController extends Controller
{
    /**
     * Get screenings data for paramedis
     */
    public function getScreenings(Request $request)
    {
        try {
            $user = Auth::user();

            if (! $user) {
                return response()->json(['error' => 'Not authenticated'], 401);
            }

            if ($user->role !== 'paramedis') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Get screenings with pagination
            $screenings = Patients::with(['answers' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])
                ->where('screening_status', 'pending')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            // Transform data for frontend
            $transformedData = $screenings->getCollection()->map(function ($screening) {
                return [
                    'id' => $screening->id,
                    'uuid' => $screening->uuid,
                    'name' => $screening->name,
                    'nik' => $screening->nik,
                    'age' => $screening->age,
                    'gender' => $screening->gender,
                    'contact' => $screening->contact,
                    'email' => $screening->email,
                    'screening_status' => $screening->screening_status,
                    'health_status' => $screening->health_status,
                    'health_check_status' => $screening->health_check_status,
                    'payment_status' => $screening->payment_status,
                    'queue' => $screening->queue,
                    'screening_date' => $screening->screening_date,
                    'created_at' => $screening->created_at,
                    'answers' => $screening->answers->map(function ($answer) {
                        return [
                            'id' => $answer->id,
                            'question_id' => $answer->question_id,
                            'answer_text' => $answer->answer_text,
                            'queue' => $answer->queue,
                            'isOnline' => $answer->isOnline ?? 0,
                            'created_at' => $answer->created_at,
                        ];
                    }),
                ];
            });

            return response()->json([
                'data' => $transformedData,
                'current_page' => $screenings->currentPage(),
                'last_page' => $screenings->lastPage(),
                'per_page' => $screenings->perPage(),
                'total' => $screenings->total(),
                'last_update' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error getting screenings: '.$e->getMessage());

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get screening count for realtime updates
     */
    public function getScreeningCount()
    {
        try {
            $user = Auth::user();

            if (! $user || $user->role !== 'paramedis') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $pendingCount = Patients::where('screening_status', 'pending')->count();
            $completedCount = Patients::where('screening_status', 'completed')->count();
            $totalCount = Patients::count();

            return response()->json([
                'pending_count' => $pendingCount,
                'completed_count' => $completedCount,
                'total_count' => $totalCount,
                'last_update' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error getting screening count: '.$e->getMessage());

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
