<?php

namespace App\Models;

use App\Models\Users\PatientsOnline;
use Illuminate\Database\Eloquent\Model;

class QrCode extends Model
{
    protected $table = "qr_codes";

    protected $fillable = ['patient_id', 'qrcode'];

    public function patient()
    {
        return $this->belongsTo(PatientsOnline::class);
    }
}