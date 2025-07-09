<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NikAlreadyExistsException extends Exception
{
    /**
     * Render the exception into an HTTP response.
     */
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Data yang diberikan tidak valid.',
            'errors' => [
                'nik' => ['NIK yang Anda masukkan sudah terdaftar. NIK harus unik dan terdiri dari 16 digit.'],
            ],
        ], 422);
    }
}
