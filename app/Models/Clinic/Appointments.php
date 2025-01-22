<?php

namespace App\Models\Clinic;

use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointments extends Model
{
    use HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'appointment_date',
        'appointment_time',
        'is_scheduled',
        'patient_id',
        'status',
    ];

    public function patient()
    {
        return $this->belongsTo(Patients::class, 'patient_id', 'id');
    }

    public function getStatusAttribute($value)
    {
        // Mengubah huruf pertama menjadi kapital
        return ucfirst(strtolower($value));
    }
}
