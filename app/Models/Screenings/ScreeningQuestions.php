<?php

namespace App\Models\Screenings;

use Illuminate\Database\Eloquent\Model;

class ScreeningQuestions extends Model
{
    protected $table = 'screening_offline_questions';

    protected $fillable = ['question_text', 'answer_type', 'options', 'condition_value', 'requires_doctor'];

    protected $casts = ['options' => 'array'];

    public function answers()
    {
        return $this->hasMany(ScreeningAnswers::class, 'question_id');
    }
    public function setQuestionTextAttribute($value)
    {
        $this->attributes['question_text'] = ucwords(strtolower($value));
    }
}
