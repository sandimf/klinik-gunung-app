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
        Schema::create('payments_online', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->foreignId('patient_id')->constrained('patients_online');
            $table->foreignId('screening_online_answer_id')->nullable()->constrained('screening_online_answers')->onDelete('set null');
            $table->unsignedBigInteger('cashier_id')->nullable()->constrained('cashiers');
            $table->boolean('payment_status')->default(false);
            $table->decimal('amount_paid', 10, 2)->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_proof')->nullable();
            $table->enum('status', ['pending', 'checking', 'completed'])->default('pending');
            $table->string('qr_code')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments_online');
    }
};
