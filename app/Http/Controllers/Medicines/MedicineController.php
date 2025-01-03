<?php

namespace App\Http\Controllers\Medicines;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medicines\StoreMedicineRequest;
use App\Http\Requests\Medicines\UpdateMedicineRequest;
use App\Models\Medicines\Medicine;
use App\Models\Medicines\MedicineBatch;
use App\Models\Medicines\MedicinePricing;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class MedicineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Cache::forget('medicines_list');

        // Menggunakan cache untuk meningkatkan performa query
        $medicines = Cache::remember('medicines_list', now()->addMinutes(10), function () {
            return Medicine::with(['pricing', 'batches'])->latest()->paginate(10);
        });

        return Inertia::render('Dashboard/Cashier/Apotek/Index', [
            'medicines' => $medicines,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMedicineRequest $request)
    {
        // Validasi sudah ditangani oleh StoreMedicineRequest
        $medicine = Medicine::create([
            'barcode' => $request->barcode,
            'medicine_name' => $request->medicine_name,
            'brand_name' => $request->brand_name,
            'category' => $request->category,
            'quantity' => $request->quantity,
            'dosage' => $request->dosage,
            'content' => $request->content,
        ]);

        MedicinePricing::create([
            'medicine_id' => $medicine->id,
            'purchase_price' => $request->purchase_price,
            'otc_price' => $request->otc_price,
        ]);

        MedicineBatch::create([
            'medicine_id' => $medicine->id,
            'batch_number' => $request->batch_number,
            'quantity' => $request->quantity,
            'expiration_date' => $request->expiration_date,
            'supplier' => $request->supplier,
        ]);

        // Clear cache setelah data obat ditambahkan
        Cache::forget('medicines_list');

        return redirect()->back()->with('success', 'Obat berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Medicine $medicine)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Medicine $medicine)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMedicineRequest $request, $id)
    {
        // Validasi sudah dilakukan oleh UpdateMedicineRequest

        // Menemukan data obat berdasarkan ID
        $medicine = Medicine::findOrFail($id);

        // Mengupdate data obat
        $medicine->update([
            'barcode' => $request->barcode,
            'medicine_name' => $request->medicine_name,
            'brand_name' => $request->brand_name,
            'category' => $request->category,
            'quantity' => $request->quantity,
            'dosage' => $request->dosage,
            'content' => $request->content,
        ]);

        // Mengupdate data harga obat
        $pricing = MedicinePricing::where('medicine_id', $id)->first();
        if ($pricing) {
            $pricing->update([
                'purchase_price' => $request->purchase_price,
                'otc_price' => $request->otc_price,
            ]);
        }

        // Mengupdate data batch obat
        $batch = MedicineBatch::where('medicine_id', $id)->first();
        if ($batch) {
            $batch->update([
                'batch_number' => $request->batch_number,
                'quantity' => $request->quantity,
                'expiration_date' => $request->expiration_date,
                'supplier' => $request->supplier,
            ]);
        }

        // Setelah berhasil mengupdate, hapus cache jika ada
        Cache::forget('medicines_list');

        return redirect()->route('medicine.index')->with('success', 'Obat berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Medicine $medicine)
    {
        //
    }
}
