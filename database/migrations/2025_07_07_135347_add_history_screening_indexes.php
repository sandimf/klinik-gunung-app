<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Removed duplicate indexes for patients table - already created in previous migration
        Schema::table('patients_online', function (Blueprint $table) {
            // Removed duplicate name index - already created in previous migration
            $table->index('screening_status');
        });
        // Removed duplicate indexes for screening_offline_answers and screening_online_answers - already created in previous migrations
    }

    public function down()
    {
        // Removed duplicate index drops for patients table - already handled in previous migration
        Schema::table('patients_online', function (Blueprint $table) {
            // Removed duplicate name index drop - already handled in previous migration
            $table->dropIndex(['screening_status']);
        });
        // Removed duplicate index drops for screening_offline_answers and screening_online_answers - already handled in previous migrations
    }
};
