<?php

namespace App\Http\Controllers\Consultation;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Consultation\BodyPart;

class BodyController extends Controller
{
    public function index()
    {
        $bodyPartData = BodyPart::pluck('data', 'name')->toArray();
        return Inertia::render('BodyMap', [
            'initialBodyPartData' => $bodyPartData,
        ]);
    }

    public function store(Request $request)
{
    // Validate the incoming data
    $validated = $request->validate([
        'bodyPartsData' => 'required|array',
        'bodyPartsData.*.id' => 'required|string', // Validate that each object has `id`
        'bodyPartsData.*.data' => 'required|string', // Validate that each object has `data`
    ]);

    $data = $validated['bodyPartsData'];

    $ids = array_column($data, 'id'); // ['head', 'chest']
    $descriptions = array_column($data, 'data'); // ['head data', 'chest data']

    $combinedNames = implode(', ', $ids);
    $combinedData = implode(', ', $descriptions);

    // Save data to the database
    BodyPart::create([
        'name' => $combinedNames,
        'data' => $combinedData,
    ]);

    return redirect()->back()->with('success', 'Data berhasil disimpan.');
}


    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'bodyPart' => 'required|string',
    //         'data' => 'required|string',
    //     ]);

    //     BodyPart::updateOrCreate(
    //         ['name' => $validated['bodyPart']],
    //         ['data' => $validated['data']]
    //     );

    //     return redirect()->back();
    // }

    public function show()
    {
        // Ambil data dari database berdasarkan `id` atau patient_id tertentu
        $bodyPart = BodyPart::where('id', 4)->first(); // Contoh: id = 4
    
        // Jika data tidak ditemukan, kirim data kosong ke front-end
        if (!$bodyPart) {
            return Inertia::render('Dashboard/Doctor/Consultation/Show', [
                'bodyPartData' => [],
            ]);
        }
    
        // Pisahkan 'name' dan 'data' menjadi array
        $ids = explode(', ', $bodyPart->name); // Contoh: ['head', 'neck', 'chest']
        $descriptions = explode(', ', $bodyPart->data); // Contoh: ['deskripsi head', 'deskripsi neck', 'deskripsi chest']
    
        // Gabungkan menjadi key-value pairs
        $bodyPartData = array_combine($ids, $descriptions);
    
        // Kirim data ke front-end
        return Inertia::render('Dashboard/Doctor/Consultation/Show', [
            'bodyPartData' => $bodyPartData,
        ]);
    }
    
}
