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
        Schema::create('survey_checkpoints', function (Blueprint $table) {
            $table->id('checkpoint_id');
            $table->string('title');
            $table->string('comment')->nullable();
            $table->foreignId('survey_id')->constrained('surveys', 'survey_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_checkpoints');
    }
};
