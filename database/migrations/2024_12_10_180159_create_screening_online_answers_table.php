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
        Schema::create('screening_online_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('screening_online_questions')->onDelete('cascade');
            $table->foreignId('patient_id')->constrained('patients_online')->onDelete('cascade');
            $table->text('answer_text')->nullable();
            // Antri
            $table->integer('queue')->default(0);
            $table->boolean('isOnline')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screening_online_answers');
    }
};
