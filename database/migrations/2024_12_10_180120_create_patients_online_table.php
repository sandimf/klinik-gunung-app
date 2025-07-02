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
        Schema::create('patients_online', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('nik', 16)->unique();
            $table->string('name')->nullable();
            $table->string('place_of_birth');
            $table->string('date_of_birth');
            $table->string('rt_rw')->nullable();
            $table->string('address');
            $table->string('village'); // Kelurahan/Desa
            $table->string('district'); // Kecamatan
            $table->string('religion'); // Agama
            $table->string('marital_status'); // Status Perkawinan
            $table->string('occupation'); // Pekerjaan
            $table->string('nationality')->default('WNI'); // Kewarganegaraan
            $table->enum('gender', ['laki-laki', 'perempuan', 'lainnya']);
            $table->string('email')->unique();
            $table->integer('age')->nullable();
            $table->string('blood_type')->nullable();
            $table->string('contact')->unique();
            $table->string('ktp_images')->nullable();
            $table->enum('scan_status', ['pending', 'completed'])->nullable();
            $table->enum('screening_status', ['completed', 'pending', 'cancelled'])->nullable();
            $table->enum('health_status', ['pending', 'healthy', 'sick', 'under treatment', 'butuh_dokter', 'butuh_pendamping'])->nullable();
            $table->enum('health_check_status', ['pending', 'completed'])->nullable();
            $table->enum('payment_status', ['completed', 'pending', 'cancelled', 'checking'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients_online');
    }
};
