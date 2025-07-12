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
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'selected_medicine_id')) {
                $table->unsignedBigInteger('selected_medicine_id')->nullable()->after('payment_proof');
                // Foreign key opsional, jika ingin strict
                $table->foreign('selected_medicine_id')->references('id')->on('medicines');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'selected_medicine_id')) {
                $table->dropForeign(['selected_medicine_id']);
                $table->dropColumn(['selected_medicine_id']);
            }
        });
    }
};
