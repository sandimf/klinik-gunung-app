<?php

namespace App\Http\Controllers\Roles\Paramedis\Screening;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ParamedisScreeningListController extends Controller
{
    public function index(Request $request)
    {
        // Validate and sanitize page parameter
        $page = max(1, (int) filter_var($request->input('page', 1), FILTER_VALIDATE_INT, [
            'options' => [
                'default' => 1,
                'min_range' => 1,
            ],
        ]));

        $perPage = 10;

        // Sanitize search input
        $search = $request->input('search');
        if ($search !== null) {
            $search = filter_var($search, FILTER_SANITIZE_STRING);
            $search = trim(strip_tags($search));
        }

        $offline = DB::table('patients')
            ->select('patients.id', 'patients.uuid', 'patients.name', 'patients.screening_status', 'q.queue')
            ->join(DB::raw('(
                SELECT patient_id, MIN(queue) as queue
                FROM screening_offline_answers
                WHERE answer_text IS NOT NULL
                GROUP BY patient_id
            ) as q'), 'patients.id', '=', 'q.patient_id')
            ->where('patients.screening_status', 'pending');

        if (! empty($search)) {
            $offline->where('patients.name', 'like', '%'.$search.'%');
        }

        // Build and execute the query with proper parameter binding
        $query = $offline->orderBy('q.queue', 'asc');

        try {
            // Get the paginated results with error handling
            $offline = $query->paginate(
                $perPage,
                ['*'],
                'page',
                $page
            );
        } catch (\Exception $e) {
            // Log the error and return first page as fallback
            $offline = $query->paginate($perPage, ['*'], 'page', 1);
        }

        // Debug: Log the actual data being sent to the frontend
        $debugData = $offline->toArray();
        unset($debugData['data']);

        return Inertia::render('Dashboard/Paramedis/Screenings/Index', [
            'screenings_offline' => $offline,
            'screenings_online' => [],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
