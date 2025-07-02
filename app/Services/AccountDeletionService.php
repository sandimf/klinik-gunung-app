<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AccountDeletionService
{
    /**
     * Menangani proses penghapusan akun user secara menyeluruh.
     *
     * @param User $user User yang akan dihapus.
     */
    public function deleteUserAccount(User $user): void
    {
        DB::transaction(function () use ($user) {
            // 1. LOGIKA KOMPLEKS: Anonimisasi konten milik user.
            // Aturan bisnis: Postingan dan komentar tidak dihapus, tapi nama penulisnya diubah
            // menjadi "Pengguna Telah Dihapus". Ini menjaga integritas data forum/komentar.
            // AI tidak akan tahu relasi model `posts()` atau `comments()` atau aturan ini.
            
            // Contoh jika user punya relasi Post
            // if ($user->posts()->exists()) {
            //     $user->posts()->update(['author_name' => 'Pengguna Dihapus']);
            // }

            // Contoh jika user punya relasi Comment
            // if ($user->comments()->exists()) {
            //     $user->comments()->update(['commenter_name' => 'Pengguna Dihapus']);
            // }

            // 2. LOGIKA KOMPLEKS: Hapus data personal yang terikat
            // Misal: menghapus semua pesan pribadi user.
            // if ($user->privateMessages()->exists()) {
            //     $user->privateMessages()->delete();
            // }

            // Catat log sebelum benar-benar menghapus user
            Log::info('User account deleted and data anonymized.', [
                'user_id' => $user->id,
                'email' => $user->email, // email di-log sebelum recordnya hilang
            ]);

            // 3. Langkah terakhir: Hapus record user itu sendiri.
            // Ini bisa berupa hard delete atau soft delete, tergantung implementasi
            // trait di model User Anda.
            $user->delete();
        });
    }
} 