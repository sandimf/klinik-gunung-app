<?php

namespace App\Http\Controllers\Roles\Admin\Management;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AmountRequest;
use App\Models\Roles\Admin\Management\AmountScreening;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AmountScreeningController extends Controller
{
    // Menampilkan semua harga screening
    public function index()
    {
        $amounts = AmountScreening::all();

        return Inertia::render('Dashboard/Admin/Amount/Index', [
            'amounts' => $amounts,
        ]);
    }

    // Menyimpan harga screening baru
    public function store(AmountRequest $request)
    {
        $validated = $request->validated();
        AmountScreening::create($validated);

        return redirect()->back()->with('success', 'Harga berhasil ditambahkan.');
    }

    // Mengupdate harga screening
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);
        $amount = AmountScreening::findOrFail($id);
        $amount->update($validated);

        return redirect()->back()->with('success', 'Harga berhasil diupdate.');
    }

    // Menghapus harga screening
    public function destroy($id)
    {
        $amount = AmountScreening::findOrFail($id);
        $amount->delete();

        return redirect()->back()->with('success', 'Harga berhasil dihapus.');
    }

    public function show(Request $request)
    {
        $type = $request->query('type');
        $amount = AmountScreening::where('type', $type)->first();

        return Inertia::render('Dashboard/Cashier/Screenings/Payments/OfflinePayments', [
            'type' => $type,
            'amount' => $amount,
        ]);
    }
}
