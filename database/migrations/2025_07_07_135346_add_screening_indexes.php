<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->index('payment_status');
        });
        Schema::table('patients_online', function (Blueprint $table) {
            $table->index('payment_status');
            $table->index('name');
        });
        Schema::table('screening_online_answers', function (Blueprint $table) {
            $table->index('patient_id');
            $table->index('queue');
        });
    }

    public function down()
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropIndex(['payment_status']);
        });
        Schema::table('patients_online', function (Blueprint $table) {
            $table->dropIndex(['payment_status']);
            $table->dropIndex(['name']);
        });
        Schema::table('screening_online_answers', function (Blueprint $table) {
            $table->dropIndex(['patient_id']);
            $table->dropIndex(['queue']);
        });
    }
};
