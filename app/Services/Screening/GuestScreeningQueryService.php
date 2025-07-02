<?php

namespace App\Services\Screening;

use App\Models\Ai\Apikey;
use App\Models\Screenings\ScreeningQuestions;

class GuestScreeningQueryService
{
    /**
     * Mengambil semua data yang diperlukan untuk halaman screening tamu.
     *
     * @return array<string, mixed>
     */
    public function getScreeningPageData(): array
    {
        return [
            'questions' => ScreeningQuestions::all(),
            'apiKey' => Apikey::first()?->api_key,
        ];
    }
} 