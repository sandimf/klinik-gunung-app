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
        Schema::create('screening_offline_questions', function (Blueprint $table) {
            $table->id();
            $table->string('question_text');
            $table->enum('answer_type', ['text', 'number', 'date', 'textarea', 'select', 'checkbox', 'checkbox_textarea']);
            $table->json('options')->nullable(); // Jika ada pilihan (select atau checkbox)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screening_offline_questions');
    }
};
