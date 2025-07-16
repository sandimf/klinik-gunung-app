<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Clinic\PhysicalExamination;
use App\Models\Community\Community;
use App\Models\Users\Cashier;
use App\Models\Users\Paramedis;
use App\Models\Users\Patients;
use App\Models\Users\PatientsOnline;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'role',
        'name',
        'avatar',
        'email_verified_at',
        'email',
        'password',
        'provider',
        'provider_id',
        'provider_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [

        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function patient()
    {
        return $this->hasOne(Patients::class, 'user_id');
    }

    public function patients()
    {
        return $this->hasMany(Patients::class); // Relasi ke model Patient
    }

    public function paramedis()
    {
        return $this->hasMany(Paramedis::class); // Relasi ke model Patient
    }

    public function cashier()
    {
        return $this->hasMany(Cashier::class); // Relasi ke model Patient
    }

    public function patient_online()
    {
        return $this->hasOne(PatientsOnline::class, 'user_id');
    }

    public function community()
    {
        return $this->hasOne(Community::class);
    }

    public function physicalExaminationsAsParamedis()
    {
        return $this->hasMany(PhysicalExamination::class, 'paramedis_id');
    }

    // Relasi ke pemeriksaan fisik sebagai dokter
    public function physicalExaminationsAsDoctor()
    {
        return $this->hasMany(PhysicalExamination::class, 'doctor_id');
    }

    public function physicalExaminations()
    {
        return $this->hasMany(PhysicalExamination::class, 'paramedis_id');
    }
}
