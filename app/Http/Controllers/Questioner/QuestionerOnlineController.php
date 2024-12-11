<?php

namespace App\Http\Controllers\Questioner;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Screenings\ScreeningOnlineQuestions;

class QuestionerOnlineController extends Controller
{
    public function index()
    {
        // Ambil semua pertanyaan dengan pagination
        $questions = ScreeningOnlineQuestions::paginate(10); // Ambil 10 pertanyaan per halaman

        // Render halaman dengan daftar pertanyaan
        return Inertia::render('Dashboard/Admin/Questionnaire/Online/Index', [
            'questions' => $questions,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Admin/Questionnaire/Online/Partials/Create');
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
        $question = ScreeningOnlineQuestions::create([
            'question_text' => $request->question_text,
            'answer_type' => $request->answer_type,
            'options' => $request->options,
        ]);

        // Redirect back with success message
        return redirect()->back()->with('success', 'Pertanyaan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        // Validasi input
        $request->validate([
            'question_text' => 'required|string',
            'answer_type' => 'required|string',
            'options' => 'nullable|array',
        ]);
    
        // Cari dan perbarui data berdasarkan ID
        $questioner = ScreeningOnlineQuestions::findOrFail($id);
    
        $questioner->update([
            'question_text' => $request->question_text,
            'answer_type' => $request->answer_type,
            'options' => $request->options,
        ]);
    
        // Kembalikan respons
        return redirect()->route('questioner-online.index')
                         ->with('success', 'Questioner updated successfully.');
    }
}
