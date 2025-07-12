<?php

namespace App\Http\Controllers\Paramedis;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use App\Models\Users\Patients;

class ScreeningAiSuggestionController extends Controller
{
    public function suggest(Request $request)
    {
        $screeningId = $request->input('screening_id');
        $screening = Patients::with(['answers.question'])->findOrFail($screeningId);

        $answers = $screening->answers->map(function($answer) {
            return [
                'pertanyaan' => $answer->question->question_text ?? '',
                'jawaban' => $answer->answer_text,
            ];
        })->toArray();

        $prompt = "Berdasarkan hasil screening berikut, berikan saran medis singkat, edukasi, atau tindak lanjut yang sesuai untuk pasien (jawab dalam bahasa Indonesia, singkat, dan profesional):\n\n";
        foreach ($answers as $item) {
            $prompt .= "- {$item['pertanyaan']}: {$item['jawaban']}\n";
        }

        $result = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                ['role' => 'system', 'content' => 'Kamu adalah asisten medis klinik. Jawab singkat, jelas, dan profesional.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.3,
            'max_tokens' => 256,
        ]);

        $saran = $result->choices[0]->message->content ?? 'Tidak ada saran.';

        return response()->json(['suggestion' => $saran]);
    }
} 