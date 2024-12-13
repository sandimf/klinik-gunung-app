<?php

namespace App\Models\Payments;

use App\Models\Users\Cashier;
use App\Models\Users\PatientsOnline;
use Illuminate\Database\Eloquent\Model;
use App\Models\Screenings\ScreeningOnlineAnswers;

class PaymentOnline extends Model
{
    // Menentukan nama tabel, jika berbeda dengan nama model
    protected $table = 'payments_online';

    // Menentukan kolom-kolom yang bisa diisi (mass assignable)
    protected $fillable = [
        'name',
        'patient_id', 
        'screening_online_answer_id', 
        'cashier_id', 
        'payment_status', 
        'amount_paid', 
        'payment_method', 
        'payment_proof', 
        'status',
        'qr_code',
    ];

    // Menentukan relasi ke model Patient (one-to-many)
    public function patient()
    {
        return $this->belongsTo(PatientsOnline::class, 'patient_id');
    }

    // Menentukan relasi ke model ScreeningOnlineAnswer (optional one-to-many)
    public function screeningAnswer()
    {
        return $this->belongsTo(ScreeningOnlineAnswers::class, 'screening_online_answer_id');
    }

    // Menentukan relasi ke model Cashier (one-to-many)
    public function cashier()
    {
        return $this->belongsTo(Cashier::class, 'cashier_id');
    }
}
