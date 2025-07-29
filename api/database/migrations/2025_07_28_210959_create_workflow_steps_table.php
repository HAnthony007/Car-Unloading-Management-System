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
        Schema::create('workflow_steps', function (Blueprint $table) {
            $table->id('step_id');
            $table->string('step_name');
            $table->string('step_status');
            $table->dateTime('step_started_at');
            $table->dateTime('step_finished_at')->nullable();
            $table->foreignId('follow_up_file_id')->constrained('follow_up_files', 'follow_up_file_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflow_steps');
    }
};
