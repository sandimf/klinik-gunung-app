<?php

namespace App\Http\Controllers\Roles\Admin\Management;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EmergencyRequest;
use App\Models\EmergecyContactModel;
use Inertia\Inertia;

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
