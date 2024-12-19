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
    // Validasi input untuk pertanyaan
    $request->validate([
        'question_text' => 'required|string|max:255',
        'answer_type' => 'required|string|in:text,number,date,textarea,select,checkbox,checkbox_textarea',
        'options' => 'nullable|array', // Pilihan untuk jawaban (jika tipe jawaban membutuhkan)
        'condition_value' => 'nullable|string', // Nilai kondisi yang memicu pemeriksaan dokter
        'requires_doctor' => 'required|boolean', // Apakah jawaban memerlukan pemeriksaan dokter
    ]);

    // Format semua string menjadi huruf besar di awal kata (Title Case)
    $formattedQuestionText = ucwords(strtolower($request->question_text));
    $formattedConditionValue = $request->condition_value ? ucwords(strtolower($request->condition_value)) : null;
    $formattedOptions = $request->options 
        ? array_map(fn($option) => ucwords(strtolower($option)), $request->options) 
        : null;

    // Buat pertanyaan baru
    $question = ScreeningQuestions::create([
        'question_text' => $formattedQuestionText,
        'answer_type' => $request->answer_type,
        'options' => $formattedOptions, // Simpan opsi dalam format JSON
        'condition_value' => $formattedConditionValue, // Format Title Case untuk kondisi
        'requires_doctor' => $request->requires_doctor, // Apakah kondisi ini membutuhkan dokter
    ]);

    // Redirect kembali dengan pesan sukses
    return redirect()->route('questioner.index')->with('message', 'Pertanyaan berhasil dibuat');
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
        $questioner = ScreeningQuestions::findOrFail($id);
    
        $questioner->update([
            'question_text' => $request->question_text,
            'answer_type' => $request->answer_type,
            'options' => $request->options,
        ]);
    
        // Kembalikan respons
        return redirect()->route('questioner.index')
                         ->with('success', 'Questioner updated successfully.');
    }


}
