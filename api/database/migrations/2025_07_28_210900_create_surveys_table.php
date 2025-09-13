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
        Schema::create('surveys', function (Blueprint $table) {
            $table->id('survey_id');
            $table->dateTime('survey_date');
            $table->string('survey_name')->default('Untitled Survey');
            $table->text('survey_description')->nullable();
            $table->string('overall_status');
            $table->foreignId('agent_id')->constrained('users', 'user_id');
            // Allow multiple surveys per discharge (no unique constraint)
            $table->foreignId('discharge_id')->constrained('discharges', 'discharge_id')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surveys');
    }
};
