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
        Schema::create('community', function (Blueprint $table) {
            $table->id();
            $table->string('bio')->nullable();
            $table->string('username')->unique();
            $table->string('slug')->unique()->nullable();
            $table->text('content')->nullable();
            $table->string('image')->nullable();
            $table->enum('status', ['pending', 'approve', 'reject'])->default('pending'); // Perbaikan di sin
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community');
    }
};
