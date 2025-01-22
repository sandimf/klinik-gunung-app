<?php

namespace App\Http\Controllers\Questioner;

use App\Http\Controllers\Controller;
use App\Models\Screenings\ScreeningOnlineQuestions;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        // Validasi input untuk pertanyaan
        $request->validate([
            'question_text' => 'required|string|max:255',
            'answer_type' => 'required|string|in:text,number,date,textarea,select,checkbox,checkbox_textarea',
            'options' => 'nullable|array', // Pilihan untuk jawaban
        ]);

        // Format input menjadi huruf besar di awal setiap kata (Title Case)
        $formattedQuestionText = ucwords(strtolower($request->question_text));
        $formattedOptions = $request->options
            ? array_map(fn($option) => ucwords(strtolower($option)), $request->options)
            : null;

        // Buat pertanyaan baru
        $question = ScreeningOnlineQuestions::create([
            'question_text' => $formattedQuestionText,
            'answer_type' => $request->answer_type,
            'options' => $formattedOptions,
        ]);

        // Redirect kembali dengan pesan sukses
        return redirect()->back()->with('success', 'Pertanyaan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        // Validasi input
        $request->validate([
            'question_text' => 'required|string|max:255',
            'answer_type' => 'required|string|in:text,number,date,textarea,select,checkbox,checkbox_textarea',
            'options' => 'nullable|array',
        ]);

        // Format input menjadi huruf besar di awal setiap kata (Title Case)
        $formattedQuestionText = ucwords(strtolower($request->question_text));
        $formattedOptions = $request->options
            ? array_map(fn($option) => ucwords(strtolower($option)), $request->options)
            : null;

        // Cari dan perbarui data berdasarkan ID
        $questioner = ScreeningOnlineQuestions::findOrFail($id);

        $questioner->update([
            'question_text' => $formattedQuestionText,
            'answer_type' => $request->answer_type,
            'options' => $formattedOptions,
        ]);

        // Kembalikan respons
        return redirect()->route('questioner-online.index')
            ->with('message', 'Questioner updated successfully.');
    }
}
