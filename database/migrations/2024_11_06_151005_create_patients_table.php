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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('nik', 16)->unique();
            $table->string('name')->nullable();
            $table->string('place_of_birth')->nullable(false);
            $table->string('date_of_birth');
            $table->string('rt_rw')->nullable(false);
            $table->string('address');
            $table->string('village');
            $table->string('district');
            $table->string('religion');
            $table->string('marital_status');
            $table->string('occupation');
            $table->string('nationality')->default('WNI');
            $table->enum('gender', ['laki-laki', 'perempuan', 'lainnya'])->default('lainnya');
            $table->string('email')->unique();
            $table->string('blood_type')->nullable();
            $table->integer('age')->nullable();
            $table->string('contact')->unique();
            $table->string('ktp_images')->nullable();
            $table->decimal('tinggi_badan', 5, 2); // 999.99 cm
            $table->decimal('berat_badan', 5, 2);  // 999.99 kg
            $table->enum('screening_status', ['completed', 'pending', 'cancelled'])->nullable();
            $table->enum('health_status', ['pending', 'sehat', 'tidak_sehat'])->nullable();
            $table->enum('health_check_status', ['pending', 'completed'])->nullable();
            $table->enum('payment_status', ['completed', 'pending', 'cancelled'])->nullable();
            $table->boolean('konsultasi_dokter')->nullable();
            $table->boolean('konsultasi_dokter_status')->nullable();
            $table->enum('pendampingan', ['pendampingan_paramedis', 'pendampingan_perawat', 'pendampingan_dokter'])->nullable();
            $table->integer('queue')->nullable();
            $table->date('screening_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
