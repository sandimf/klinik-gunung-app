# Sistem Flash Toast

Dokumentasi untuk sistem flash toast yang telah distandarkan di aplikasi Klinik Gunung.

## Overview

Sistem toast telah direfactor untuk menggunakan pendekatan global yang konsisten:
- Flash messages dikirim dari controller menggunakan Laravel's flash session
- Frontend menggunakan hook `useFlashToast` untuk menampilkan toast secara otomatis
- Semua toast ditangani secara global melalui `ToastProvider`

## Backend Usage (Controller)

### 1. Menggunakan Trait HasFlashMessages (Recommended)

```php
<?php

namespace App\Http\Controllers\Example;

use App\Http\Controllers\Controller;
use App\Traits\HasFlashMessages;

class ExampleController extends Controller
{
    use HasFlashMessages;

    public function store(Request $request)
    {
        try {
            // Logic here...
            
            // Success message
            return $this->flashSuccess('Data berhasil disimpan!');
            
            // Success with redirect to specific route
            return $this->flashSuccess('Data berhasil disimpan!', 'dashboard.index');
            
        } catch (\Exception $e) {
            // Error message
            return $this->flashError('Terjadi kesalahan saat menyimpan data.');
        }
    }
    
    public function update(Request $request, $id)
    {
        // Warning message
        return $this->flashWarning('Data telah diperbarui tetapi perlu verifikasi.');
        
        // Info message
        return $this->flashInfo('Proses sedang berjalan di background.');
    }
}
```

### 2. Menggunakan Flash Session Langsung

```php
// Success
return back()->with('success', 'Operasi berhasil!');
return redirect()->route('dashboard')->with('success', 'Data telah disimpan!');

// Error
return back()->with('error', 'Terjadi kesalahan!');

// Warning
return back()->with('warning', 'Peringatan: Data mungkin tidak lengkap.');

// Info
return back()->with('info', 'Informasi: Proses sedang berjalan.');
```

## Frontend Usage

### Automatic Flash Handling

Toast akan muncul secara otomatis karena sudah diintegrasikan dalam `ToastProvider` global. **Tidak perlu setup manual** di setiap halaman.

### Manual Toast (Jika Diperlukan)

```jsx
import { toast } from 'sonner';

// Success toast
toast.success('Operasi berhasil!');

// Error toast  
toast.error('Terjadi kesalahan!');

// Warning toast
toast.warning('Peringatan!');

// Info toast
toast.info('Informasi penting');

// Custom toast dengan icon
toast.success('Data tersimpan!', {
    icon: <CheckCircle className="w-5 h-5" />,
    duration: 4000
});
```

## Arsitektur

### 1. ToastProvider (`/resources/js/Components/ToastProvider.jsx`)
- Komponen global yang dibungkus di `app.jsx`
- Menggunakan hook `useFlashToast` untuk mendeteksi flash messages
- Menyediakan `<Toaster />` component dari Sonner

### 2. useFlashToast Hook (`/resources/js/hooks/flash.jsx`)
- Hook yang membaca flash messages dari Inertia page props
- Secara otomatis menampilkan toast berdasarkan jenis flash message
- Mendukung: `success`, `message`, `error`, `warning`, `info`

### 3. HasFlashMessages Trait (`/app/Traits/HasFlashMessages.php`)
- Trait untuk controller yang menyediakan helper methods
- Methods: `flashSuccess()`, `flashError()`, `flashWarning()`, `flashInfo()`
- Mendukung redirect ke route tertentu atau back()

## Flash Message Types

| Type | Key | Warna | Durasi | Penggunaan |
|------|-----|-------|--------|------------|
| Success | `success` atau `message` | Hijau | 4s | Operasi berhasil |
| Error | `error` | Merah | 5s | Error/kesalahan |
| Warning | `warning` | Kuning | 4s | Peringatan |
| Info | `info` | Biru | 4s | Informasi |

## Migration Guide

### Dari Toast Manual ke Flash System

**Sebelum:**
```jsx
// Di component
import { toast } from 'sonner';
import useFlashToast from '@/hooks/flash';

export default function Component() {
    useFlashToast(); // Manual call
    
    return (
        <>
            <YourContent />
            <Toaster position="top-center" /> {/* Manual toaster */}
        </>
    );
}
```

**Sesudah:**
```jsx
// Di component - TIDAK PERLU SETUP APAPUN
export default function Component() {
    return <YourContent />; // Toast otomatis muncul dari flash messages
}
```

### Update Controller

**Sebelum:**
```php
return back()->with('message', 'Success!'); // Inconsistent key
```

**Sesudah:**
```php
use App\Traits\HasFlashMessages;

class Controller extends BaseController {
    use HasFlashMessages;
    
    return $this->flashSuccess('Success!'); // Consistent & clean
}
```

## Best Practices

1. **Gunakan trait `HasFlashMessages`** untuk konsistensi
2. **Hapus manual toast setup** dari komponen individual
3. **Gunakan key yang konsisten**: `success`, `error`, `warning`, `info`
4. **Pesan harus jelas dan informatif**
5. **Gunakan bahasa Indonesia** untuk pesan user-facing

## Troubleshooting

### Toast Tidak Muncul
- Pastikan `ToastProvider` terpasang di `app.jsx`
- Cek apakah flash message menggunakan key yang benar
- Periksa console untuk error JavaScript

### Toast Muncul Dua Kali
- Hapus manual `useFlashToast()` call dari komponen
- Hapus manual `<Toaster />` dari komponen individual

### Styling Issues
- Toast menggunakan CSS variables dari theme
- Pastikan Tailwind classes untuk toast tersedia
- Periksa `ToastProvider` configuration
