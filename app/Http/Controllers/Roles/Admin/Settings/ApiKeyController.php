<?php

namespace App\Http\Controllers\Roles\Admin\Settings;

use Inertia\Inertia;
use App\Models\Ai\Apikey;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ApikeyRequest;

class ApiKeyController extends Controller
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
    $apiKey = Apikey::first();

    if (!$apiKey) {
      $apiKey = new Apikey;
    }

    $apiKey->api_key = $request->input('api_key');
    $apiKey->save();

    return redirect()->back()->with('message', 'Api Key Berhasil di Perbaharui');
  }
}
