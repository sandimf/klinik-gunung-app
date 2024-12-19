<?php

namespace App\Models\EMR;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $table = '';
    protected $fillable = [
        'appointment_id',
        'record_number',
        'special_notes',
        'prescription',
        'follow_up_schedule',
    ];

    // Event untuk generate nomor medical record
    protected static function booted()
    {
        static::creating(function ($medicalRecord) {
            // Generate nomor medical record (contoh: MR000001)
            $latestRecord = self::latest('id')->first();
            $latestNumber = $latestRecord ? intval(substr($latestRecord->record_number, 2)) : 0;
            $medicalRecord->record_number = 'MR' . str_pad($latestNumber + 1, 6, '0', STR_PAD_LEFT);
        });
    }
}
