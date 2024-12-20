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
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('physical_examination_id')->constrained('physical_examinations')->onDelete('cascade');
            $table->string('medical_record_number')->unique();
            $table->text('special_notes')->nullable(); // Catatan medis tambahan
            $table->string('prescription')->nullable(); // Resep obat
            $table->dateTime('follow_up_schedule')->nullable(); // Tanggal tindak lanjut
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
