<?php

namespace App\Models\Clinic;

use App\Models\EMR\MedicalRecord;
use App\Models\User;
use App\Models\Users\Doctor;
use App\Models\Users\Paramedis;
use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Model;

class PhysicalExamination extends Model
{
    protected $fillable = [
        'patient_id',
        'paramedis_id',
        'doctor_id',
        'blood_pressure',
        'heart_rate',
        'oxygen_saturation',
        'respiratory_rate',
        'body_temperature',
        'physical_assessment',
        'reason',
        'medical_advice',
        'health_status',
    ];

    // Relasi ke pasien
    public function patient()
    {
        return $this->belongsTo(Patients::class);
    }

    // Relasi ke paramedis
    public function paramedis()
    {
        return $this->belongsTo(Paramedis::class, 'paramedis_id');
    }

    // Relasi ke tabel doctor (user yang bertindak sebagai dokter)
    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    // Relasi ke tabel patients

    public function examiner()
    {
        return $this->belongsTo(User::class, 'examiner_id');
    }

    protected function generateMedicalRecordNumber()
    {
        $lastRecord = MedicalRecord::latest()->first(); // Ambil rekam medis terakhir
        $lastNumber = $lastRecord ? intval(substr($lastRecord->medical_record_number, 2)) : 0; // Ambil angka terakhir
        $newNumber = $lastNumber + 1; // Tambah 1 untuk nomor baru

        return 'MR'.str_pad($newNumber, 4, '0', STR_PAD_LEFT); // Format nomor: MR0001, MR0002, dst.
    }
}
