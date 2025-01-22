<?php

namespace App\Http\Controllers\AI;

use App\Http\Controllers\Controller;
use App\Models\Ai\Apikey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApikeyController extends Controller
{
    public function index()
    {
        // Mengambil satu data API Key
        $apikey = Apikey::first();
    
        return Inertia::render('Dashboard/Admin/Api/Index', [
            'apikeys' => $apikey
        ]);
    }
    

    public function update(Request $request)
{
    // Validasi input API Key jika diperlukan
    $request->validate([
        'api_key' => 'required|string|max:255',
    ]);

    // Mencari entri pertama API Key
    $apiKey = Apikey::first();

    // Jika tidak ada API Key, buat entri baru
    if (!$apiKey) {
        $apiKey = new Apikey(); // Membuat instansi baru jika tidak ditemukan
    }

    // Memperbarui atau menyetel API Key
    $apiKey->api_key = $request->input('api_key');
    $apiKey->save(); // Menyimpan perubahan atau entri baru ke database

    // Redirect kembali dengan pesan sukses
    return redirect()->back()->with('message', 'API Key has been successfully saved or updated');
}

    
    
}
