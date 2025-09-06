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
        Schema::create('photos', function (Blueprint $table) {
            $table->id('photo_id');
            $table->string('photo_path');
            $table->dateTime('taken_at');
            $table->text('photo_description')->nullable();
            $table->foreignId('discharge_id')->constrained('discharges', 'discharge_id')->cascadeOnDelete();
            $table->foreignId('survey_id')->nullable()->constrained('surveys', 'survey_id')->nullOnDelete();
            $table->foreignId('checkpoint_id')->nullable()->constrained('survey_checkpoints', 'checkpoint_id')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
