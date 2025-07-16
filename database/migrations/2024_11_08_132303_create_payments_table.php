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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('no_transaction')->unique();
            $table->foreignId('patient_id')->constrained('patients');
            $table->foreignId('medicine_batch_id')->nullable()->constrained('medicine_batches')->onDelete('cascade');
            $table->foreignId('cashier_id')->nullable()->constrained('cashiers')->nullOnDelete();
            $table->boolean('payment_status')->default(false);
            $table->decimal('amount_paid', 10, 2)->nullable();
            $table->string('payment_method')->nullable();
            $table->integer('quantity_product')->nullable();
            $table->decimal('price_product', 10, 2)->nullable();
            $table->string('payment_proof')->nullable();
            $table->text('service_types')->nullable(); // <--- ini sebelumnya untuk menyimpan jenis pelayanan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
