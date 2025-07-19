<?php

use App\Http\Controllers\Clinic\OfficeController;
use App\Http\Controllers\Medicines\MedicineController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Transaction\PurchaseController;
use App\Http\Controllers\Users\WarehouseController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Inventory Routes
|--------------------------------------------------------------------------
|
| Routes for inventory management including medicines, products, and warehouse
|
*/

// ===================================================================
// CASHIER INVENTORY ROUTES
// ===================================================================

Route::prefix('dashboard/cashier')->middleware(['role:cashier'])->group(function () {
    // Medicine Management
    Route::resource('medicine', MedicineController::class)
        ->only(['index', 'store', 'update']);

    Route::get('apotek/import', [MedicineController::class, 'create'])->name('import.apotek');
    Route::post('apotek/import/csv', [MedicineController::class, 'importCombined'])->name('import.combined');

    // Office Management
    Route::resource('office', OfficeController::class)
        ->only(['index'])
        ->middleware(['auth']);

    Route::get('office/pdf', [OfficeController::class, 'generatePdf'])->name('cashier.pdf.office');

    // Product Management
    Route::get('product', [ProductController::class, 'index'])->name('product.cashier');
    Route::post('product/store', [ProductController::class, 'store'])->name('product.store.cashier');
    Route::patch('product/{id}', [ProductController::class, 'update'])->name('product.update.cashier');
    Route::delete('product/{id}', [ProductController::class, 'destroy'])->name('product.destroy.cashier');

    // Transaction Management
    Route::get('transaction/purchase', [PurchaseController::class, 'index'])->name('cashier.transcation');
    Route::post('transaction/purchase/store', [PurchaseController::class, 'store'])->name('product.checkout');
    Route::get('transaction/history', [PurchaseController::class, 'history'])->name('product.history.checkout');
});

// ===================================================================
// WAREHOUSE DASHBOARD ROUTES
// ===================================================================

Route::prefix('dashboard/warehouse')->middleware(['role:warehouse'])->group(function () {
    // Dashboard & Profile
    Route::get('/', [WarehouseController::class, 'index'])->name('warehouse.dashboard');
    Route::get('profile', [WarehouseController::class, 'profile'])->name('warehouse.profile');

    // Medicine Management
    Route::get('medicine', [WarehouseController::class, 'medicine'])->name('medicine.warehouse');
    Route::post('medicine/store', [MedicineController::class, 'store'])->name('medicine.warehouse.store');
});
