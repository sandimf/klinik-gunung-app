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
