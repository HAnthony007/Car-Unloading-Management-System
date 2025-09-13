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
            $table->string('title_checkpoint');
            $table->string('comment_checkpoint')->nullable();
            $table->text('description_checkpoint')->nullable();
            $table->string('result_checkpoint')->nullable();
            $table->unsignedInteger('order_checkpoint')->nullable();
            $table->foreignId('survey_id')
                ->constrained('surveys', 'survey_id')
                ->cascadeOnDelete();
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
