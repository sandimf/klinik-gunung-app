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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->date('appointment_date'); // Tanggal janji temu
            $table->boolean('is_scheduled')->default(false); // Apakah terjadwal
            $table->foreignId('patient_id')->constrained()->onDelete('cascade'); // Relasi ke tabel patients
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
