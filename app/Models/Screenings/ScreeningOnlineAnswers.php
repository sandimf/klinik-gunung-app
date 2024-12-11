<?php

namespace App\Models\Screenings;

use App\Models\Users\PatientsOnline;
use Illuminate\Database\Eloquent\Model;

class ScreeningOnlineAnswers extends Model
{
    protected $table = 'screening_online_answers';

    protected $fillable = ['question_id', 'patient_id', 'answer_text', 'queue'];

    public function question()
    {
        return $this->belongsTo(ScreeningOnlineQuestions::class, 'question_id');
    }

    public function patient_online()
    {
        return $this->belongsTo(PatientsOnline::class, 'patient_id');
    }
}
