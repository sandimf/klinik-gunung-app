<?php

namespace App\Http\Controllers;

use App\Models\Users\Patients;
use App\Services\QrCodeService;
use Illuminate\Http\Request;

class TestQrController extends Controller
{
    public function testQrGeneration(Request $request)
    {
        try {
            // Get a patient for testing (you can specify patient ID in request)
            $patientId = $request->get('patient_id', 1);
            $patient = Patients::find($patientId);

            if (! $patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found',
                ], 404);
            }

            $qrCodeService = new QrCodeService;
            $result = $qrCodeService->generatePatientQrCode($patient);

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Test failed: '.$e->getMessage(),
            ], 500);
        }
    }

    public function testPatientData($uniqueLink)
    {
        try {
            $qrCodeService = new QrCodeService;
            $patientData = $qrCodeService->getPatientDataByLink($uniqueLink);

            if (! $patientData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient data not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $patientData,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Test failed: '.$e->getMessage(),
            ], 500);
        }
    }
}
