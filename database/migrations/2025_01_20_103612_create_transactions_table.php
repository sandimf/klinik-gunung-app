<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('no_transaction')->unique();
            $table->decimal('total_price', 10, 2); // Total harga transaksi
            $table->enum('payment_method', ['cash', 'transfer', 'qris']); // Metode pembayaran
            $table->string('payment_proof')->nullable(); // Path ke bukti pembayaran jika ada
            $table->json('items_details'); // Menyimpan detail item sebagai JSON
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions_details');
    }
};
