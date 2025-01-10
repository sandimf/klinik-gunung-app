<?php

namespace App\Models\Users;

use App\Models\User;
use App\Models\Payments\PaymentOnline;
use Illuminate\Database\Eloquent\Model;
use App\Models\Clinic\PhysicalExaminationOnline;
use App\Models\Screenings\ScreeningOnlineAnswers;
use App\Models\Screenings\ScreeningOnlineQuestions;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PatientsOnline extends Model
{
    use HasFactory;

    protected $table = 'patients_online';
    protected $fillable = [
        'user_id',
        'nik',
        'name',
        'place_of_birth',
        'date_of_birth',
        'rt_rw',
        'address',
        'village',
        'district',
        'religion',
        'marital_status',
        'occupation',
        'nationality',
        'gender',
        'email',
        'age',
        'blood_type',
        'contact',
        'ktp_images',
        'screening_status',
        'health_status',
        'health_check_status',
        'payment_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function answers()
    {
        return $this->hasMany(ScreeningOnlineAnswers::class, 'patient_id');
    }

    public function payment()
    {
        return $this->hasOne(PaymentOnline::class, 'patient_id', 'id');
    }
    public function payments()
    {
        return $this->hasOne(PaymentOnline::class, 'patient_id', 'id');
    }

    public function patient()
    {
        return $this->belongsTo(PatientsOnline::class, 'patient_id', 'id');
    }

    public function result()
    {
        return $this->hasMany(PhysicalExaminationOnline::class, 'patient_id');
    }
    public function physicalExaminations()
    {
        return $this->hasMany(PhysicalExaminationOnline::class, 'patient_id');
    }

    public function question()
    {
        return $this->hasMany(ScreeningOnlineQuestions::class, 'patient_id');
    }
}
