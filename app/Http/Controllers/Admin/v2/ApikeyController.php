<?php

namespace App\Http\Controllers\Admin\v2;

use Inertia\Inertia;
use App\Models\Ai\Apikey;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ApikeyRequest;

class ApikeyController extends Controller
{
    public function index()
    {
        // Mengambil satu data API Key
        $apikey = Apikey::first();

        return Inertia::render('Dashboard/Admin/Api/Index', [
            'apikeys' => $apikey,
        ]);
    }

    public function update(ApikeyRequest $request)
    {
        // Mencari entri pertama API Key
        $apiKey = Apikey::first();

        // Jika tidak ada API Key, buat entri baru
        if (! $apiKey) {
            $apiKey = new Apikey; // Membuat instansi baru jika tidak ditemukan
        }

        // Memperbarui atau menyetel API Key
        $apiKey->api_key = $request->input('api_key');
        $apiKey->save(); // Menyimpan perubahan atau entri baru ke database

        // Redirect kembali dengan pesan sukses
        return redirect()->back()->with('message', 'API Key has been successfully saved or updated');
    }
}
