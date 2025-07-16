<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\QrCodeService;
use Illuminate\Http\JsonResponse;

class PatientDataController extends Controller
{
    protected $qrCodeService;

    public function __construct(QrCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
    }

    /**
     * Get patient data by unique link from QR code
     */
    public function getPatientData($uniqueLink): JsonResponse
    {
        try {
            $patientData = $this->qrCodeService->getPatientDataByLink($uniqueLink);

            if (! $patientData) {
                return response()->json([
                    'message' => 'Patient data not found or invalid QR code',
                    'error_code' => 'PATIENT_NOT_FOUND',
                ], 404);
            }

            return response()->json([
                'Klinik Gunung' => $patientData,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve patient data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify QR code link (optional endpoint for validation)
     */
    public function verifyQrCode($uniqueLink): JsonResponse
    {
        try {
            $patient = \App\Models\Users\Patients::where('unique_link', $uniqueLink)->first();

            if (! $patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid QR code',
                    'valid' => false,
                ], 404);
            }

            return response()->json([
                'valid' => true,
                'patient_name' => $patient->name,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify QR code',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
