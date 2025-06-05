<?php

namespace App\Http\Controllers\Screenings;

use App\Http\Controllers\Controller;
use App\Jobs\SendScreeningOnline;
use App\Models\Screenings\ScreeningOnlineAnswers;
use App\Models\Screenings\ScreeningOnlineQuestions;
use App\Models\Users\PatientsOnline;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScreeningOnlineController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $user = Auth::user();

        // Periksa apakah data pasien ada di tabel `patients`
        $patient = PatientsOnline::where('user_id', $user->id)->first();

        if (! $patient) {
            // Redirect ke halaman untuk melengkapi data pasien
            return redirect()->route('information.index')
                ->with('message', 'Masukan data diri kamu terlebih dahulu sebelum mengakses Screening online.');
        }

        // Fetch the patient and their related questionnaire answers
        $screening = PatientsOnline::with('answers', 'payment', 'result') // Eager load answers
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($screening) {
            $screening->formatted_created_at = Carbon::parse($screening->created_at)->translatedFormat('d F Y');
        }

        return Inertia::render('Dashboard/Patients/Screenings/Online/Index', [
            'screening' => $screening,
        ]);
    }

    public function create()
    {
        // Mendapatkan data pertanyaan screening
        $questions = ScreeningOnlineQuestions::all();

        // Mendapatkan data pengguna yang sedang login
        $user = Auth::user();

        // Mendapatkan data pasien terkait
        $patient = $user->patient_online;

        // Cek apakah status screening pasien adalah 'pending'
        if ($patient->screening_status === 'pending') {
            // Jika status 'pending', redirect ke halaman lain (misalnya halaman error)
            return redirect()->route('screening-online.index')
                ->with('message', 'Screening Anda Berhasil & status Anda masih pending. Silakan selesaikan pembayaran terlebih dahulu.');
        }

        // Jika status tidak 'pending', lanjutkan dan tampilkan halaman screening
        return Inertia::render('Dashboard/Patients/Screenings/Online/ScreeningOnline', [
            'questions' => $questions,
            'patient' => $patient,
        ]);
    }

    public function store(Request $request)
    {
        // Validasi data masukan dari request
        $request->validate([
            'nik' => 'required|string|max:20',
            'name' => 'required|string|max:255',
            'age' => 'required|integer',
            'contact' => 'required|string|numeric',
            'gender' => 'required|string|in:male,female,other',
            'email' => 'nullable|email|max:255',
            'answers' => 'required|array',
            'answers.*.questioner_id' => 'required|exists:screening_online_questions,id',
            'answers.*.answer' => 'required',
        ]);

        // Mencari apakah pasien dengan nik sudah ada
        $patient = PatientsOnline::where('nik', $request->nik)->first();

        // Jika pasien tidak ditemukan, buat entri pasien baru
        if (! $patient) {
            $patient = PatientsOnline::create([
                'user_id' => Auth::id(),
                'nik' => $request->nik,
                'name' => $request->name,
                'age' => $request->age,
                'gender' => $request->gender,
                'contact' => $request->contact,
                'email' => $request->email,
                'screening_status' => 'pending',
                'health_status' => 'pending',
                'health_check_status' => 'pending',
                'payment_status' => 'pending',
            ]);
        } else {
            // Jika pasien sudah ada, pastikan status tetap 'pending'
            $patient->update([
                'screening_status' => 'pending',
                'health_status' => 'pending',
                'health_check_status' => 'pending',
                'payment_status' => 'pending',
            ]);
        }

        // Dapatkan posisi antrian terakhir untuk menghindari duplikasi posisi antrian
        $lastQueuePosition = ScreeningOnlineAnswers::max('queue') ?? 0;

        foreach ($request->answers as $index => $answer) {
            $answer_text = $answer['answer'];

            // Jika jawaban memiliki 'options' dan 'textarea', gabungkan sebagai satu string
            if (is_array($answer_text) && isset($answer_text['options'], $answer_text['textarea'])) {
                $options = implode(', ', $answer_text['options']);
                $textarea = $answer_text['textarea'];
                $answer_text = trim("$options $textarea");
            }
            // Jika jawaban berupa array (untuk checkbox biasa), gabungkan opsi dengan koma
            elseif (is_array($answer_text)) {
                $answer_text = implode(', ', $answer_text);
            }

            // Simpan jawaban dengan posisi antrian yang diurutkan secara otomatis
            ScreeningOnlineAnswers::create([
                'question_id' => $answer['questioner_id'],
                'patient_id' => $patient->id,
                'answer_text' => $answer_text,
                'queue' => $lastQueuePosition + $index + 1, // Posisi antrian otomatis bertambah
            ]);
        }

        SendScreeningOnline::dispatch($patient);

        return redirect()->back()->with('message', 'Screening Anda Berhasil Di Simpan');
    }

    public function payments()
    {
        $userId = Auth::id();

        // Fetch the patient and their related questionnaire answers
        $screening = PatientsOnline::with('answers', 'payment') // Eager load answers
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        return Inertia::render('Dashboard/Patients/Screenings/Online/Index', [
            'screening' => $screening,
            'payment' => $screening->payment,
        ]);
    }

    public function generatePDF($id)
    {
        // Ambil ID pengguna yang sedang login
        $userId = Auth::id();

        // Validasi bahwa data hanya bisa diakses oleh pengguna yang memiliki hak akses
        $screening = PatientsOnline::with(['answers.question', 'physicalExaminations'])
            ->where('user_id', $userId) // Pastikan data hanya untuk pengguna saat ini
            ->where('id', $id) // Validasi bahwa ID milik data pengguna saat ini
            ->firstOrFail(); // Gagal jika data tidak ditemukan

        // Pastikan nama pasien aman untuk digunakan dalam nama file
        $patientName = preg_replace('/[^a-zA-Z0-9_]/', '', str_replace(' ', '_', $screening->name)); // Hapus karakter yang tidak diizinkan

        // Mengonversi data menjadi PDF
        $pdf = PDF::loadView('pdf.screenings.offline', [
            'screening' => $screening,
        ]);

        // Pastikan nama file aman
        $fileName = 'screening_detail_' . $patientName . '.pdf';

        // Kembalikan file PDF untuk diunduh
        return $pdf->download($fileName);
    }
}
