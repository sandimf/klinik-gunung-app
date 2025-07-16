<?php

namespace App\Http\Controllers\Paramedis\v2;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoryHealthCheckController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 20;
        $search = $request->input('search');

        // Screening Offline
        $offline = \DB::table('patients')
            ->select('patients.id', 'patients.uuid', 'patients.name', 'patients.screening_status', 'patients.health_status', 'q.queue', \DB::raw('0 as is_online'))
            ->join(\DB::raw('(
                SELECT patient_id, MIN(queue) as queue
                FROM screening_offline_answers
                WHERE answer_text IS NOT NULL
                GROUP BY patient_id
            ) as q'), 'patients.id', '=', 'q.patient_id')
            ->where('patients.screening_status', 'completed');
        if ($search) {
            $offline->where('patients.name', 'like', '%'.$search.'%');
        }

        // Screening Online
        $online = \DB::table('patients_online')
            ->select('patients_online.id', 'patients_online.uuid', 'patients_online.name', 'patients_online.screening_status', 'patients_online.health_status', 'q.queue', \DB::raw('1 as is_online'))
            ->join(\DB::raw('(
                SELECT patient_id, MIN(queue) as queue
                FROM screening_online_answers
                WHERE answer_text IS NOT NULL
                GROUP BY patient_id
            ) as q'), 'patients_online.id', '=', 'q.patient_id')
            ->where('patients_online.screening_status', 'completed');
        if ($search) {
            $online->where('patients_online.name', 'like', '%'.$search.'%');
        }

        // Gabungkan dan sorting manual
        $offlineResults = $offline->get();
        $onlineResults = $online->get();
        $merged = collect($offlineResults)->merge($onlineResults)->sortBy('queue')->values();

        // Pagination manual
        $total = $merged->count();
        $currentPage = $page;
        $items = $merged->slice(($currentPage - 1) * $perPage, $perPage)->values();
        $lastPage = (int) ceil($total / $perPage);

        // Pagination links (mirip Laravel)
        $links = [];
        $baseUrl = url()->current().'?search='.urlencode($search ?? '').'&page=';
        $links[] = ['url' => $currentPage > 1 ? $baseUrl.($currentPage - 1) : null, 'label' => '&laquo; Previous', 'active' => false];
        for ($i = 1; $i <= $lastPage; $i++) {
            $links[] = ['url' => $baseUrl.$i, 'label' => (string) $i, 'active' => $i == $currentPage];
        }
        $links[] = ['url' => $currentPage < $lastPage ? $baseUrl.($currentPage + 1) : null, 'label' => 'Next &raquo;', 'active' => false];

        return Inertia::render('Dashboard/Paramedis/Screenings/History/Index', [
            'screenings' => [
                'data' => $items,
                'current_page' => $currentPage,
                'last_page' => $lastPage,
                'per_page' => $perPage,
                'total' => $total,
                'links' => $links,
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show($uuid)
    {
        $patient = Patients::with([
            'answers.question',
            'physicalExaminations',
        ])
            ->where('uuid', $uuid)
            ->firstOrFail();

        // Menyiapkan data pertanyaan dan jawaban
        $questionsAndAnswers = $patient->answers->map(function ($answer) {
            $answerText = $answer->answer_text;

            // Parse JSON jika jawaban adalah JSON string (untuk checkbox_textarea)
            if (is_string($answerText) && (str_starts_with($answerText, '{') || str_starts_with($answerText, '['))) {
                try {
                    $parsed = json_decode($answerText, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        // Jika berhasil parse JSON, format sesuai struktur
                        if (isset($parsed['options']) && isset($parsed['textarea'])) {
                            $options = $parsed['options'];
                            $textarea = $parsed['textarea'];

                            if ($options === 'N/A' && empty($textarea)) {
                                $answerText = 'Tidak';
                            } elseif ($options === 'N/A') {
                                $answerText = $textarea;
                            } elseif (empty($textarea)) {
                                $answerText = $options;
                            } else {
                                $answerText = $options.' - '.$textarea;
                            }
                        } else {
                            $answerText = is_array($parsed) ? implode(', ', $parsed) : $parsed;
                        }
                    }
                } catch (\Exception $e) {
                    // Jika gagal parse, gunakan string asli
                }
            }

            return [
                'question' => $answer->question->question_text,
                'answer' => $answerText,
                'id' => $answer->id,
                'queue' => $answer->queue, // Menambahkan nomor antrian
            ];
        });

        // Menyiapkan data pemeriksaan fisik (history)
        $physicalExaminations = $patient->physicalExaminations->map(function ($exam) {
            return [
                'id' => $exam->id,
                'blood_pressure' => $exam->blood_pressure,
                'heart_rate' => $exam->heart_rate,
                'oxygen_saturation' => $exam->oxygen_saturation,
                'respiratory_rate' => $exam->respiratory_rate,
                'body_temperature' => $exam->body_temperature,
                'physical_assessment' => $exam->physical_assessment,
                'reason' => $exam->reason,
                'medical_advice' => $exam->medical_advice,
                'health_status' => $exam->health_status,
                'created_at' => $exam->created_at->format('Y-m-d H:i:s'),
            ];
        });

        // Mengirim data ke halaman Inertia
        return Inertia::render('Dashboard/Paramedis/Screenings/History/Questioner', [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'queue' => $patient->answers->max('queue'),
            'physicalExaminations' => $physicalExaminations,
        ]);
    }
}
