<?php

namespace App\Models\Users;

use App\Models\Clinic\PhysicalExaminationOnline;
use App\Models\Payments\PaymentOnline;
use App\Models\Screenings\ScreeningOnlineAnswers;
use App\Models\Screenings\ScreeningOnlineQuestions;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PatientsOnline extends Model
{
    use HasFactory;

    protected $table = 'patients_online';

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
    ];

//     public function attributesToArray()
// {
//     $attributes = parent::attributesToArray();

//     // Mengubah semua atribut string menjadi Title Case kecuali email
//     return array_map(function ($value, $key) {
//         // Cek jika atribut bukan email, baru diubah menjadi Title Case
//         if ($key !== 'email' && is_string($value)) {
//             return ucwords(strtolower($value));
//         }
//         return $value;
//     }, $attributes, array_keys($attributes));
// }

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
