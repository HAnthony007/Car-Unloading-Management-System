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
        Schema::create('movements', function (Blueprint $table) {
            $table->id('movement_id');
            $table->string('note')->nullable();
            $table->dateTime('timestamp');
            $table->string('from')->nullable();
            $table->string('to')->nullable();
            // Slot number when moving to Mahasarika; null elsewhere
            $table->string('parking_number', 50)->nullable();
            // Relation: each movement belongs to exactly one discharge; a discharge may have many movements
            $table->foreignId('discharge_id')->constrained('discharges', 'discharge_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movements');
    }
};
