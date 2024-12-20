<?php

namespace App\Models\Users;

use App\Models\User;
use App\Models\Payments;
use App\Models\EMR\MedicalRecord;
use App\Models\Medicines\Medicine;
use Illuminate\Database\Eloquent\Model;
use App\Models\Clinic\PhysicalExamination;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\Screenings\ScreeningQuestions;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patients extends Model
{
    use HasFactory;

    protected $table = 'patients';

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
        'contact',
        'ktp_images',
        'screening_status',
        'health_status',
        'health_check_status',
        'payment_status',
    ];


    public function attributesToArray()
    {
        $attributes = parent::attributesToArray();

        // Mengubah semua atribut string menjadi Title Case
        return array_map(function ($value) {
            return is_string($value) ? ucwords(strtolower($value)) : $value;
        }, $attributes);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function answers()
    {
        return $this->hasMany(ScreeningAnswers::class, 'patient_id');
    }
    public function question()
    {
        return $this->hasMany(ScreeningQuestions::class, 'patient_id');
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

    // Relasi dengan payments
    public function payments()
    {
        return $this->hasMany(Payments::class, 'patient_id');
    }
}
