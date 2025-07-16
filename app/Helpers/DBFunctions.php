<?php

namespace App\Helpers;

use App\Models\Users\Patients;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DBFunctions
{
    public static function getPatientCount()
    {
        try {
            // Pastikan tabel patients ada
            $count = DB::table('patients')->count();
            Log::info('Patient count retrieved:', ['count' => $count]);

            return $count;
        } catch (\Exception $e) {
            Log::error('Error getting patient count:', ['error' => $e->getMessage()]);

            // Tidak ada dummy data, return null
            return null;
        }
    }

    public static function getPatientList($limit = 10)
    {
        try {
            return DB::table('patients')
                ->select('id', 'name', 'contact', 'gender', 'created_at')
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            Log::error('Error getting patient list:', ['error' => $e->getMessage()]);

            // Tidak ada dummy data, return array kosong
            return [];
        }
    }

    public static function getPatientStats()
    {
        try {
            return [
                'total' => DB::table('patients')->count(),
                'laki-laki' => DB::table('patients')->where('gender', 'laki-laki')->count(),
                'perempuan' => DB::table('patients')->where('gender', 'perempuan')->count(),
                'today' => DB::table('patients')->whereDate('created_at', today())->count(),
                'this_week' => DB::table('patients')->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'this_month' => DB::table('patients')->whereMonth('created_at', now()->month)->count(),
            ];
        } catch (\Exception $e) {
            Log::error('Error getting patient stats:', ['error' => $e->getMessage()]);

            // Tidak ada dummy data, return array kosong
            return [];
        }
    }

    public static function searchPatientByNameOrNik($query)
    {
        try {
            return DB::table('patients')
                ->select('id', 'name', 'nik', 'contact', 'gender', 'age', 'created_at')
                ->where('name', 'like', "%$query%")
                ->orWhere('nik', 'like', "%$query%")
                ->limit(10)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            Log::error('Error searching patient by name or NIK:', ['error' => $e->getMessage()]);

            // Tidak ada dummy data, return array kosong
            return [];
        }
    }

    public static function getPatientPhysicalExamination($query)
    {
        try {
            $patient = \App\Models\Users\Patients::where('nik', $query)
                ->orWhere('name', 'like', "%$query%")
                ->first();
            if (! $patient) {
                return null;
            }
            $examination = $patient->physicalExaminations()->latest()->first();

            return $examination ? $examination->toArray() : null;
        } catch (\Exception $e) {
            \Log::error('Error getting physical examination:', ['error' => $e->getMessage()]);

            return null;
        }
    }

    public static function getPatientScreeningAnswers($query)
    {
        try {
            $patient = \App\Models\Users\Patients::where('nik', $query)
                ->orWhere('name', 'like', "%$query%")
                ->first();
            if (! $patient) {
                return [];
            }
            $answers = $patient->answers()->with('question')->get();

            return $answers->map(function ($a) {
                return [
                    'pertanyaan' => $a->question->question_text ?? '',
                    'jawaban' => $a->answer_text,
                ];
            })->toArray();
        } catch (\Exception $e) {
            \Log::error('Error getting screening answers:', ['error' => $e->getMessage()]);

            return [];
        }
    }

    public static function getPatientFullInfo($query)
    {
        $patient = \App\Models\Users\Patients::where('nik', $query)
            ->orWhere('name', 'like', "%$query%")
            ->first();
        if (! $patient) {
            return null;
        }
        $physical = $patient->physicalExaminations()->latest()->first();
        $answers = $patient->answers()->with('question')->get();

        return [
            'pribadi' => [
                'nama' => $patient->name,
                'nik' => $patient->nik,
                'kontak' => $patient->contact,
                'jenis_kelamin' => $patient->gender,
                'usia' => $patient->age,
                'tanggal_registrasi' => $patient->created_at?->format('d F Y'),
            ],
            'pemeriksaan_fisik' => $physical ? $physical->toArray() : null,
            'screening' => $answers->map(function ($a) {
                return [
                    'pertanyaan' => $a->question->question_text ?? '',
                    'jawaban' => $a->answer_text,
                ];
            })->toArray(),
        ];
    }
}
