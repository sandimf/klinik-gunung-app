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
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('barcode')->unique(); // Kode unik untuk obat
            $table->integer('quantity');
            $table->string('medicine_name', 150); // Nama obat
            $table->string('brand_name', 100); // Nama merek obat
            $table->string('category', 100); // Kategori obat
            $table->integer('dosage'); // Dosis dalam mg/ml
            $table->string('content', 150); // Kandungan obat
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
