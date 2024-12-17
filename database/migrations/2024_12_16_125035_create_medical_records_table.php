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
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade'); // Relasi ke tabel appointments
            $table->text('special_notes')->nullable(); // Catatan khusus untuk rekam medis
            $table->string('prescription')->nullable(); // Data resep (misalnya nama obat-obatan)
            $table->string('follow_up_schedule')->nullable(); // Tanggal dan waktu janji tindak lanjut dalam format string
            $table->timestamps(); // Kolom created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
