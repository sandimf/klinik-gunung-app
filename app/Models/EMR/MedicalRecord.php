<?php

namespace App\Models\EMR;

use App\Models\Clinic\PhysicalExamination;
use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $table = 'medical_records';

    protected $fillable = [
        'uuid', 'patient_id', 'physical_examination_id', 'medical_record_number',
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
    // protected static function booted()
    // {
    //     static::creating(function ($medicalRecord) {
    //         // Generate nomor MR berdasarkan ID terakhir
    //         $lastRecord = MedicalRecord::latest('id')->first();
    //         $lastNumber = $lastRecord ? (int) substr($lastRecord->medical_record_number, 2) : 0;

    //         // Set nomor MR (misalnya MR00001)
    //         $medicalRecord->medical_record_number = 'MR' . str_pad($lastNumber + 1, 5, '0', STR_PAD_LEFT);
    //     });
    // }

    //     protected function generateMedicalRecordNumber()
    // {
    //     $lastRecord = MedicalRecord::latest()->first(); // Ambil rekam medis terakhir
    //     $lastNumber = $lastRecord ? intval(substr($lastRecord->medical_record_number, 2)) : 0; // Ambil angka terakhir
    //     $newNumber = $lastNumber + 1; // Tambah 1 untuk nomor baru

    //     return 'MR' . str_pad($newNumber, 4, '0', STR_PAD_LEFT); // Format nomor: MR0001, MR0002, dst.
    // }

    protected static function boot()
    {
        parent::boot();

        // Secara otomatis menghasilkan UUID saat data dibuat
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }
}
