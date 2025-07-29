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
            $table->date('date');
            $table->string('result');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->foreignId('follow_up_file_id')->constrained('follow_up_files', 'follow_up_file_id');
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
