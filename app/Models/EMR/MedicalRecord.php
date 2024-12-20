<?php

namespace App\Models\EMR;

use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Model;
use App\Models\Clinic\PhysicalExamination;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $table = 'medical_records';

    protected $fillable = [
        'patient_id', 'physical_examination_id', 'medical_record_number',
        'special_notes', 'prescription', 'follow_up_schedule'
    ];

    // Relasi ke model Patient
    public function patient()
    {
        return $this->belongsTo(Patients::class);
    }

    // Relasi ke model PhysicalExamination
    public function physicalExamination()
    {
        return $this->belongsTo(PhysicalExamination::class);
    }

    // Event untuk generate nomor MR otomatis
    protected static function booted()
    {
        static::creating(function ($medicalRecord) {
            // Generate nomor MR berdasarkan ID terakhir
            $lastRecord = MedicalRecord::latest('id')->first();
            $lastNumber = $lastRecord ? (int) substr($lastRecord->medical_record_number, 2) : 0;

            // Set nomor MR (misalnya MR00001)
            $medicalRecord->medical_record_number = 'MR' . str_pad($lastNumber + 1, 5, '0', STR_PAD_LEFT);
        });
    }
}
