<?php

namespace App\Http\Controllers\Paramedis;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ScreeningAiSuggestionController extends Controller
{
    public function aiSaran(Request $request)
    {
        $answers = $request->input('answers');
        $patient = $request->input('patient');

        $prompt = "Berdasarkan data pasien berikut:\n";
        $prompt .= "- Nama: {$patient['name']}\n";
        $prompt .= "- Umur: {$patient['age']}\n";
        $prompt .= "- Gender: {$patient['gender']}\n";
        $prompt .= "- Tinggi: {$patient['tinggi_badan']} cm\n";
        $prompt .= "- Berat: {$patient['berat_badan']} kg\n";
        $prompt .= "\nJawaban kuesioner:\n";
        foreach ($answers as $qa) {
            $prompt .= "- {$qa['question']}: {$qa['answer']}\n";
        }
        $prompt .= "\nApakah pasien ini layak untuk melakukan pendakian gunung? Berikan jawaban langsung tanpa pengantar, maksimal 3 kalimat. Gunakan bahasa profesional yang jelas dan mudah dimengerti. Fokus pada saran medis atau rekomendasi singkat.";


        $apiKey = env('GEMINI_API_KEY');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        $response = Http::post($url, [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        // Log response untuk debugging
        \Log::info('Gemini response:', $response->json());

        if ($response->successful()) {
            $saran = $response->json('candidates.0.content.parts.0.text');
            if (!$saran) {
                $saran = "Gemini tidak mengembalikan jawaban. Silakan cek log untuk detail.";
            }
        } else {
            $saran = "Gagal mendapatkan saran dari Gemini: " . $response->body();
        }

        return redirect()->back()->with('ai_saran', $saran);
    }
} 