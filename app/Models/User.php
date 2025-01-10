<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Users\Cashier;
use App\Models\Users\Patients;
use App\Models\Community\Community;
use App\Models\Users\PatientsOnline;
use Illuminate\Notifications\Notifiable;
use App\Models\Clinic\PhysicalExamination;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

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

    public function patient_online()
    {
        return $this->hasOne(PatientsOnline::class, 'user_id');
    }

    public function community()
    {
        return $this->hasOne(Community::class);
    }


    public function cashier()
    {
        return $this->hasOne(Cashier::class, 'user_id', 'id');
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
