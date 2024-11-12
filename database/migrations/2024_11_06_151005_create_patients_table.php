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
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // $table->unsignedBigInteger('paramedis_id')->nullable();
            // $table->foreign('paramedis_id')->references('id')->on('paramedis')->onDelete('cascade');
            // $table->unsignedBigInteger('doctor_id')->nullable();
            // $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('cascade');
            $table->string('nik')->unique();
            // $table->string('images_ktp');
            $table->string('name');
            $table->string('email')->unique();
            $table->integer('age')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('contact')->nullable();
            $table->enum('screening_status', ['completed', 'pending', 'cancelled'])->nullable();
            $table->enum('health_status', ['pending', 'healthy', 'sick', 'under treatment'])->default('pending');
            $table->enum('health_check_status', ['pending', 'completed'])->default('pending');
            $table->enum('payment_status', ['completed', 'pending', 'cancelled'])->default('pending');
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
