<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index() {
        $perPage = 10;
        $search = request('search');
        $page = max(1, (int) request('page', 1));

        $query = Product::query();
        if (!empty($search)) {
            $query->where('name', 'like', "%$search%") ;
        }
        $products = $query->orderBy('id', 'desc')->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('Dashboard/Cashier/Product/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
            ],
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

    public function update(ProductRequest $request, $id)
    {
        $validatedData = $request->validated();
        $product = Product::findOrFail($id);
        try {
            $product->update($validatedData);
            return back()->with('success', 'Produk berhasil diupdate!');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat update produk. Coba lagi.');
        }
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        try {
            $product->delete();
            return back()->with('success', 'Produk berhasil dihapus!');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus produk. Coba lagi.');
        }
    }

    // Tambahkan endpoint untuk testing flash message
    public function testMessage()
    {
        return redirect()->route('product.cashier')->with('message', 'Ini pesan flash dengan key message!');
    }
}
