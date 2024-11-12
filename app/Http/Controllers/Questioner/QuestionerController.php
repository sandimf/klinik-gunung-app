<?php

namespace App\Http\Controllers\Questioner;

use App\Http\Controllers\Controller;
use App\Models\Screenings\ScreeningQuestions;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionerController extends Controller
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
        // Validate question input
        $request->validate([
            'question_text' => 'required|string',
            'answer_type' => 'required|string',
            'options' => 'nullable|array',
        ]);

        // Create a new question
        $question = ScreeningQuestions::create([
            'question_text' => $request->question_text,
            'answer_type' => $request->answer_type,
            'options' => $request->options,
        ]);

        // Redirect back with success message
        return redirect()->back()->with('success', 'Pertanyaan berhasil ditambahkan.');
    }
}
