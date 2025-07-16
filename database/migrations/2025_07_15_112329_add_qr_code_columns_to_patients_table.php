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
            $table->string('qr_code_path')->nullable()->after('screening_date');
            $table->string('unique_link', 128)->unique()->nullable()->after('qr_code_path');
            $table->string('verification_token', 64)->unique()->nullable()->after('unique_link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn(['qr_code_path', 'unique_link', 'verification_token']);
        });
    }
};
