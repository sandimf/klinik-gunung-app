<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\EmergecyContactModel;
use App\Http\Requests\Admin\EmergencyRequest;

class EmergencyContactController extends Controller
{
    public function index()
    {
        $emergencyContacts = EmergecyContactModel::all();

        return Inertia::render('Dashboard/Admin/EmergencyContact/Index', [
            'emergencyContacts' => $emergencyContacts,
        ]);
    }

    public function update(EmergencyRequest $request)
    {
        $emergecy = EmergecyContactModel::first();

        if (! $emergecy) {
            $emergecy = new EmergecyContactModel;
        }
        $emergecy->name = $request->input('name');
        $emergecy->contact = $request->input('contact');
        $emergecy->save(); // Menyimpan perubahan atau entri baru ke database

        // Redirect atau berikan respons sesuai kebutuhan
        return redirect()->back()->with('success', 'Data berhasil disimpan.');
    }
}
