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
        Schema::create('physical_examinations', function (Blueprint $table) {
            $table->id();
        
            // Relasi ke tabel patients (dengan foreign key constraint)
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
        
            // Relasi ke tabel paramedis dan doctor (nullable, dengan foreign key constraint ke tabel users)
            $table->foreignId('paramedis_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('users')->nullOnDelete();
        
            // Kolom untuk data pemeriksaan fisik
            $table->string('blood_pressure')->nullable(); // Tekanan darah
            $table->integer('heart_rate')->nullable(); // Denyut jantung
            $table->integer('oxygen_saturation')->nullable(); // Saturasi oksigen
            $table->integer('respiratory_rate')->nullable(); // Laju pernapasan
            $table->decimal('body_temperature', 5, 2)->nullable(); // Suhu tubuh
        
            // Kolom lainnya
            $table->text('physical_assessment')->nullable(); // Penilaian fisik
            $table->text('reason')->nullable(); // Alasan konsultasi
            $table->text('medical_advice')->nullable(); // Saran medis
            $table->enum('health_status', ['healthy', 'butuh_dokter', 'butuh_pendamping'])->nullable(); // Status kesehatan
        
            // Timestamp kolom created_at dan updated_at
            $table->timestamps();
        });
        
        

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('physical_examinations');
    }
};
