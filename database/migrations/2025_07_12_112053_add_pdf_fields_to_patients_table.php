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
            $table->string('pdf_path')->nullable()->after('konsultasi_dokter_status');
            $table->timestamp('pdf_generated_at')->nullable()->after('pdf_path');
            $table->enum('pdf_generation_status', ['pending', 'processing', 'completed', 'failed', 'permanently_failed'])->default('pending')->after('pdf_generated_at');
            $table->text('pdf_generation_error')->nullable()->after('pdf_generation_status');
            $table->string('autocrat_document_id')->nullable()->after('pdf_generation_error');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn([
                'pdf_path',
                'pdf_generated_at',
                'pdf_generation_status',
                'pdf_generation_error',
                'autocrat_document_id',
            ]);
        });
    }
};
