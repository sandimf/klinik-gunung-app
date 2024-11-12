<?php

namespace App\Models\Screenings;

use App\Models\Users\Patients;
use Illuminate\Database\Eloquent\Model;

class ScreeningAnswers extends Model
{
    protected $table = 'screening_offline_answers';

    protected $fillable = ['question_id', 'patient_id', 'answer_text', 'queue'];

    public function question()
    {
        return $this->belongsTo(ScreeningQuestions::class, 'question_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patients::class, 'patient_id');
    }
}
