<?php

namespace App\Http\Controllers\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Clinic\Appointments;
use App\Models\Users\Patients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Periksa apakah data pasien ada di tabel `patients`
        $patient = Patients::where('user_id', $user->id)->first();

        if (! $patient) {
            // Redirect ke halaman untuk melengkapi data pasien
            return redirect()->route('information.index')
                ->with('message', 'Please complete your patient profile before accessing appointments.');
        }

        // Ambil semua janji temu dengan data pasien (eager loading)
        $appointments = Appointments::with('patient')
            ->where('patient_id', $patient->id)
            ->latest('created_at')
            ->get();

        return Inertia::render('Dashboard/Patients/Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }

    public function store(Request $request)
    {

        // Ambil user yang sedang login
        $user = Auth::user();

        // Cari record pasien yang terkait dengan pengguna yang sedang login
        $patient = Patients::where('user_id', $user->id)->first();

        // Jika pasien tidak ditemukan, kembalikan error
        if (! $patient) {
            return response()->json([
                'message' => 'Patient record not found for the logged-in user.',
            ], 404);
        }

        // Validasi input
        $validated = $request->validate([
            'appointment_date' => 'required|date',               // Harus berupa tanggal
            'appointment_time' => 'required|date_format:H:i:s',  // Harus sesuai format HH:mm:ss
            'is_scheduled' => 'required|boolean',                // Harus berupa boolean
        ]);

        // Simpan data ke database
        $appointment = Appointments::create([
            'appointment_date' => $validated['appointment_date'],
            'appointment_time' => $validated['appointment_time'],
            'is_scheduled' => $validated['is_scheduled'],
            'patient_id' => $patient->id,
            'status' => 'pending',
        ]);

        // Berikan respon sukses
        return redirect()->route('appointments.index')
            ->with('success', 'Appointment created successfully!');
    }

    public function update(Request $request, $id)
    {
        // Cari appointment berdasarkan ID
        $appointment = Appointments::find($id);

        // Periksa apakah appointment ditemukan
        if (! $appointment) {
            return response()->json(['message' => 'Appointment not found.'], 404);
        }

        // Perbarui status menjadi Cancelled
        $appointment->status = 'cancelled';
        $appointment->save();

        return redirect()->route('appointments.index')
            ->with('message', 'Janji Temu Berhasil di Batalkan');
    }
}
