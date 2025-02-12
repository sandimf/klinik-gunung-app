<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
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

    public function store(Request $request)
    {
        // Validasi data yang dikirim
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        try {
            // Menyimpan produk baru ke dalam database
            Product::create($validatedData);

            // Mengarahkan kembali dengan pesan sukses
            return redirect()->route('product.cashier')->with('message', 'Produk berhasil ditambahkan!');
        } catch (\Exception $e) {
            // Jika terjadi error, menampilkan pesan error
            return redirect()->route('product.cashier')->with('error', 'Terjadi kesalahan saat menyimpan produk. Coba lagi.');
        }
    }
}
