<?php

namespace App\Models\Users;

use App\Models\Clinic\PhysicalExamination;
use App\Models\Medicines\Medicine;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patients extends Model
{
    use HasFactory;

    protected $table = 'patients';

    protected $fillable = ['user_id', 'images_ktp', 'nik', 'name', 'age', 'gender', 'email', 'screening_status', 'payment_status', 'health_status', 'health_check_status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function answers()
    {
        return $this->hasMany(ScreeningAnswers::class, 'patient_id');
    }

    public function physicalExaminations()
    {
        return $this->hasMany(PhysicalExamination::class, 'patient_id');
    }

    public function medicines()
    {
        return $this->belongsToMany(Medicine::class, 'medicine_patient', 'patient_id', 'medicine_id')
            ->withPivot('quantity');
    }
}
