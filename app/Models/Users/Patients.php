<?php

namespace App\Models\Users;

use App\Models\Clinic\PhysicalExamination;
use App\Models\Medicines\Medicine;
use App\Models\Payments;
use App\Models\QrCode;
use App\Models\Screenings\ScreeningAnswers;
use App\Models\Screenings\ScreeningQuestions;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Patients extends Model
{
    use HasFactory;

    protected $table = 'patients';

    protected $fillable = [
        'uuid',
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
        'screening_date',
        'queue',
    ];

    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = strtolower($value);
    }

    public function attributesToArray()
    {
        $attributes = parent::attributesToArray();

        // Mengubah semua atribut string menjadi Title Case, kecuali email
        foreach ($attributes as $key => $value) {
            if (is_string($value) && $key !== 'email') {
                $attributes[$key] = ucwords(strtolower($value));
            }
        }

        return $attributes;
    }

    public function user()
    {
        return $this->belongsTo(User::class); // Relasi ke model User
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

    public function qrCode()
    {
        return $this->hasOne(QrCode::class);
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
