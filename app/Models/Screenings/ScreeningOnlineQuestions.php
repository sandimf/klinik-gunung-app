<?php

namespace App\Models\Screenings;

use Illuminate\Database\Eloquent\Model;

class ScreeningOnlineQuestions extends Model
{
    protected $table = 'screening_online_questions';

    protected $fillable = ['question_text', 'answer_type', 'options'];

    protected $casts = ['options' => 'array'];

    public function answers()
    {
        return $this->hasMany(ScreeningOnlineAnswers::class, 'question_id');
    }
}
