<?php

namespace App\Models\Users;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use App\Models\Screenings\ScreeningOnlineAnswers;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PatientsOnline extends Model
{
    use HasFactory;

    protected $table = 'patients_online';
    protected $fillable = ['user_id', 'images_ktp', 'nik', 'name', 'age', 'gender', 'email','contact', 'screening_status', 'payment_status', 'health_status', 'health_check_status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function answers()
    {
        return $this->hasMany(ScreeningOnlineAnswers::class, 'patient_id');
    }

    // public function physicalExaminations()
    // {
    //     return $this->hasMany(PhysicalExamination::class, 'patient_id');
    // }
}
