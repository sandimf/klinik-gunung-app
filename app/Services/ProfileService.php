<?php

namespace App\Services;

use App\Jobs\SyncProfileToCrm;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProfileService
{
    /**
     * Mengelola logika update profil user yang kompleks.
     *
     * @param  User  $user  User yang akan diupdate.
     * @param  array  $validatedData  Data yang sudah tervalidasi dari request.
     * @param  UploadedFile|null  $avatarFile  File avatar baru jika ada.
     */
    public function updateUser(User $user, array $data, ?UploadedFile $avatarFile): void
    {
        // Gunakan DB Transaction untuk memastikan semua operasi berhasil
        // atau tidak sama sekali. Ini penting untuk konsistensi data.
        DB::transaction(function () use ($user, $data, $avatarFile) {
            $oldEmail = $user->email;
            $oldAvatar = $user->avatar;

            if ($avatarFile) {
                // 1. LOGIKA KOMPLEKS: Hapus avatar lama sebelum menyimpan yang baru
                // Ini mencegah penumpukan file tak terpakai di storage.
                if ($oldAvatar && Storage::disk('public')->exists($oldAvatar)) {
                    Storage::disk('public')->delete($oldAvatar);
                }
                $data['avatar'] = $avatarFile->store('avatars', 'public');
            }

            // Update data user
            $user->fill($data);

            if ($user->isDirty('email')) {
                // 2. LOGIKA KOMPLEKS: Audit trail untuk perubahan data sensitif
                // AI tidak akan tahu bahwa kita perlu mencatat perubahan email.
                Log::info('User email changed', [
                    'user_id' => $user->id,
                    'old_email' => $oldEmail,
                    'new_email' => $user->email,
                ]);
                $user->email_verified_at = null;
            }

            $user->save();

            // 3. LOGIKA KOMPLEKS: Integrasi dengan sistem lain (misal: CRM)
            // Proses ini dijalankan di background agar tidak memperlambat response ke user.
            // AI tidak tahu kita punya integrasi dengan CRM.
            if ($user->wasChanged()) {
                SyncProfileToCrm::dispatch($user)->onQueue('notifications');
            }
        });
    }
}
