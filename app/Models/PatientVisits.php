<?php

namespace App\Models;

use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PatientVisits extends Model
{
    use HasFactory;

    // Define the table name explicitly (optional if it follows Laravel's conventions)
    protected $table = 'patient_visits';

    // Mass assignable attributes
    protected $fillable = [
        'patient_id',
        'patient_name',
        'visit_date',
        'visit_type',
        'patient_status',
        'examination_results',
        'notes'
    ];

    // Define the relationship to the Patient model (if you have a Patient model)
    public function patient()
    {
        return $this->belongsTo(Patients::class, 'patient_id');
    }

    // Optionally, you can define mutators and accessors if you need to format data
    // Example: format the visit date
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
