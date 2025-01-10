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
        Schema::create('consultation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->nullable()->constrained()->onDelete('set null');  // Patient ID (nullable if the patient is new)
            $table->string('patient_name')->nullable();  // Patient's name if the patient is new
            $table->date('visit_date');
            $table->enum('visit_type', ['Physical Examination', 'Medical Consultation', 'Medical Screening', 'Follow-up']);
            $table->enum('patient_status', ['Registered', 'Not Registered']);  // Patient's registration status
            $table->text('examination_results')->nullable();  // Doctor's examination results
            $table->text('notes')->nullable();  // Additional notes from the doctor
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation');
    }
};
