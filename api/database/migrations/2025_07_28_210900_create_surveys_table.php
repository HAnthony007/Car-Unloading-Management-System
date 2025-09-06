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
            $table->string('overall_status');
            $table->foreignId('agent_id')->constrained('users', 'user_id');
            $table->foreignId('discharge_id')->unique()->constrained('discharges', 'discharge_id')->cascadeOnDelete();
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
