<?php

namespace App\Http\Controllers\Ai;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class KtpAnalysisController extends Controller
{
    // public function analyze(Request $request)
    // {
    //     $request->validate([
    //         'image' => 'required|string',
    //     ]);

    //     $base64Image = $request->input('image');

    //    // Get Gemini API key from env or config
    //     $apiKey = env('GEMINI_API_KEY');

    //     if(!$apiKey) {
    //          return response()->json(['error' => 'Gemini API Key not found'], 500);
    //     }

    //     $prompt = '
    //         Analyze this KTP (Indonesian ID card) image and extract the following information:
    //          - NIK (ID Number)
    //          - Nama (Name)
    //          - Tempat/Tgl Lahir (Place/Date of Birth)
    //          - Jenis Kelamin (Gender)
    //          - Alamat (Address)
    //          - RT/RW (Neighborhood/Community Unit)
    //          - Kelurahan/Desa (Village)
    //          - Kecamatan (District)
    //          - Agama (Religion)
    //          - Status Perkawinan (Marital Status)
    //          - Pekerjaan (Occupation)
    //          - Kewarganegaraan (Nationality)
    //          - Berlaku Hingga (Valid Until)
    //          - Golongan Darah (Blood Type)

    //         Present the extracted information in a JSON format with these fields as keys.
    //     ';
    //      try {
    //         $response = Http::withHeaders([
    //             'Content-Type' => 'application/json',
    //         ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey, [
    //                 'contents' => [
    //                     [
    //                      'parts' => [
    //                          ['text' => $prompt],
    //                         ['inlineData' => [
    //                          'mimeType' => 'image/jpeg',
    //                          'data' => $base64Image
    //                          ]]
    //                         ]
    //                      ]
    //                 ]
    //             ]);

    //            if($response->failed()) {
    //                return response()->json(['error' => 'Failed to generate content'], $response->status());
    //             }

    //            $data = $response->json();

    //            $extractedText = $data['candidates'][0]['content']['parts'][0]['text'];


    //             // Extract JSON content from the response text (remove code block)
    //             $jsonStart = strpos($extractedText, "{");
    //             $jsonEnd = strrpos($extractedText, "}") + 1;
    //             $jsonString = substr($extractedText, $jsonStart, $jsonEnd - $jsonStart);

    //             // Parse the JSON string
    //             $parsedData = json_decode($jsonString, true);

    //            return response()->json($parsedData);

    //      } catch (\Exception $e) {
    //         return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
    //     }

    // }
}
