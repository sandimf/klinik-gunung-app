<?php

namespace App\Models\Clinic;

use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Consultation extends Model
{
    use HasFactory;

    protected $table = 'consultation';

    protected $fillable = [
        'patient_id',
        'patient_name',
        'visit_date',
        'visit_type',
        'patient_status',
        'examination_results',
        'notes'
    ];

    public function patient()
    {
        return $this->belongsTo(Patients::class, 'patient_id');
    }

    public function getVisitDateAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('d-m-Y');
    }

    // You can also define scopes to query specific types of visits
    public function scopeRegistered($query)
    {
        return $query->where('patient_status', 'Registered');
    }

    public function scopeNotRegistered($query)
    {
        return $query->where('patient_status', 'Not Registered');
    }
}
