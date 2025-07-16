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
        Schema::table('medicine_patient', function (Blueprint $table) {
            if (! Schema::hasColumn('medicine_patient', 'quantity')) {
                $table->integer('quantity')->default(0)->after('medicine_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medicine_patient', function (Blueprint $table) {
            if (Schema::hasColumn('medicine_patient', 'quantity')) {
                $table->dropColumn('quantity');
            }
        });
    }
};
