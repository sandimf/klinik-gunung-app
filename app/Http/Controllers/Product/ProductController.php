<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::paginate(10);

        return Inertia::render('Dashboard/Cashier/Product/Index', [
            'products' => $products,
        ]);
    }

    public function store(ProductRequest $request)
    {
        // Validasi data yang dikirim
        $validatedData = $request->validated();

        try {
            // Menyimpan produk baru ke dalam database
            Product::create($validatedData);

            // Mengarahkan kembali dengan pesan sukses
            return back()->with('success', 'Produk berhasil ditambahkan!');
        } catch (\Exception $e) {
            // Jika terjadi error, menampilkan pesan error
            return back()->with('error', 'Terjadi kesalahan saat menyimpan produk. Coba lagi.');
        }
    }

    // Tambahkan endpoint untuk testing flash message
    public function testMessage()
    {
        return redirect()->route('product.cashier')->with('message', 'Ini pesan flash dengan key message!');
    }
}
