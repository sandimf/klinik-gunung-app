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
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('nik')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->integer('age')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('contact')->nullable();
            $table->enum('screening_status', ['completed', 'pending', 'cancelled'])->nullable();
            $table->enum('health_status', ['pending', 'healthy', 'sick', 'under treatment'])->nullable();
            $table->enum('health_check_status', ['pending', 'completed'])->nullable();
            $table->enum('payment_status', ['completed', 'pending', 'cancelled'])->nullable();
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
