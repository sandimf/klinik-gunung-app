<?php

namespace App\Http\Controllers\Admin\v2\Questioner;

use App\Http\Controllers\Controller;
use App\Models\Screenings\ScreeningQuestions;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionerForScreeningController extends Controller
{
    public function index()
    {

        // Ambil semua pertanyaan dengan pagination
        $questions = ScreeningQuestions::paginate(10); // Ambil 10 pertanyaan per halaman

        // Render halaman dengan daftar pertanyaan
        return Inertia::render('Dashboard/Admin/Questionnaire/Index', [
            'questions' => $questions,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Admin/Questionnaire/Partials/Create');
    }

    public function store(Request $request)
    {
        // Validasi input untuk pertanyaan
        $request->validate([
            'question_text' => 'required|string|max:255',
            'answer_type' => 'required|string|in:text,number,date,textarea,select,checkbox,checkbox_textarea',
            'options' => 'nullable|array',
            'condition_value' => 'nullable|string',
            'requires_doctor' => 'required|boolean',
        ]);

        // Format semua string menjadi huruf besar di awal kata (Title Case)
        $formattedQuestionText = ucwords(strtolower($request->question_text));
        $formattedConditionValue = $request->condition_value ? ucwords(strtolower($request->condition_value)) : null;
        $formattedOptions = $request->options
            ? array_map(fn ($option) => ucwords(strtolower($option)), $request->options)
            : null;

        // Buat pertanyaan baru
        $question = ScreeningQuestions::create([
            'question_text' => $formattedQuestionText,
            'answer_type' => $request->answer_type,
            'options' => $formattedOptions,
            'condition_value' => $formattedConditionValue,
            'requires_doctor' => $request->requires_doctor,
        ]);

        return redirect()->route('questioner.index')->with('message', 'Pertanyaan berhasil dibuat');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'question_text' => 'required|string',
            'answer_type' => 'required|string',
            'options' => 'nullable|array',
        ]);

        try {
            $questioner = ScreeningQuestions::findOrFail($id);
            $questioner->update([
                'question_text' => $request->question_text,
                'answer_type' => $request->answer_type,
                'options' => $request->options,
            ]);

            return redirect()->back()->with('success', 'Kuestioner Berhasil di Perbaharui');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbaharui kuestioner: '.$e->getMessage());
        }
    }
}
