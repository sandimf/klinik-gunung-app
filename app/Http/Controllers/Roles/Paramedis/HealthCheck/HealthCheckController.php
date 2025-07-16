<?php

namespace App\Http\Controllers\Roles\Paramedis\HealthCheck;

use App\Http\Controllers\Controller;
use App\Models\Users\Patients;
use Inertia\Inertia;

class HealthCheckController extends Controller
{
    public function show($uuid)
    {
        $patient = Patients::with(['answers.question'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        // Format tinggi_badan dan berat_badan agar tidak ada trailing ,00/.00
        foreach (['tinggi_badan', 'berat_badan'] as $field) {
            if (isset($patient[$field]) && $patient[$field] !== null) {
                // Ubah koma ke titik jika perlu
                $value = str_replace(',', '.', $patient[$field]);
                if (is_numeric($value)) {
                    $floatVal = (float) $value;
                    $patient[$field] = $floatVal == (int) $floatVal ? (string) (int) $floatVal : rtrim(rtrim(number_format($floatVal, 2, '.', ''), '0'), '.');
                }
            }
        }

        // Menyiapkan data pertanyaan dan jawaban
        $questionsAndAnswers = $patient->answers->map(function ($answer) {
            $answerText = $answer->answer_text;
            $questionText = strtolower($answer->question->question_text);

            // Parse JSON jika jawaban adalah JSON string (untuk checkbox_textarea)
            if (is_string($answerText) && (str_starts_with($answerText, '{') || str_starts_with($answerText, '['))) {
                try {
                    $parsed = json_decode($answerText, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
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
                'queue' => $answer->queue,
            ];
        });

        // Mengirim data ke halaman Inertia
        return Inertia::render('Dashboard/Paramedis/Screenings/Details/Index', [
            'patient' => $patient,
            'questionsAndAnswers' => $questionsAndAnswers,
            'queue' => $patient->answers->max('queue'),
            'ai_saran' => session('ai_saran'), // tambahkan ini
        ]);
    }
}
