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
        Schema::create('medical_record_images', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('medical_record_id')->constrained('medical_records')->onDelete('cascade'); // Relasi ke tabel medical_records
            $table->string('image_path'); // Path file untuk foto pemeriksaan
            $table->timestamps(); // Kolom created_at dan updated_at
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_images');
    }
};
