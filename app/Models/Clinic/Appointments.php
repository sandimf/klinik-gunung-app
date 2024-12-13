<?php

namespace App\Models\Clinic;

use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    /**
     * Define the relationship with the Patient model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function patient()
    {
        return $this->belongsTo(Patients::class, 'patient_id', 'id');
    }

    /**
     * Define the relationship with the Doctor model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
}
