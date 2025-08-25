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
        Schema::create('survey_checkpoint_steps', function (Blueprint $table) {
            $table->id('step_id');
            $table->string('step_name');
            $table->string('step_status');
            $table->dateTime('step_started_at');
            $table->dateTime('step_finished_at')->nullable();
            $table->foreignId('survey_checkpoint_id')->constrained('survey_checkpoints', 'checkpoint_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_checkpoint_steps');
    }
};
