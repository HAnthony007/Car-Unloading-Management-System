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
            $table->foreignId('follow_up_file_id')->constrained('follow_up_files', 'follow_up_file_id');
            $table->foreignId('vehicle_id')->constrained('vehicles', 'vehicle_id');
            $table->foreignId('checkpoint_id')->constrained('survey_checkpoints', 'checkpoint_id');
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
