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
        Schema::table('patients', function (Blueprint $table) {
            $table->index('screening_status');
            $table->index('name');
        });
        Schema::table('screening_offline_answers', function (Blueprint $table) {
            $table->index('patient_id');
            $table->index('answer_text');
            $table->index('queue');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropIndex(['screening_status']);
            $table->dropIndex(['name']);
        });
        Schema::table('screening_offline_answers', function (Blueprint $table) {
            $table->dropIndex(['patient_id']);
            $table->dropIndex(['answer_text']);
            $table->dropIndex(['queue']);
        });
    }
};
