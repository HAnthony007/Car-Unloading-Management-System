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
        Schema::create('port_calls', function (Blueprint $table) {
            $table->id('port_call_id');
            $table->string('vessel_agent');
            $table->string('origin_port');
            $table->dateTime('estimated_arrival')->nullable();
            $table->dateTime('arrival_date');
            $table->dateTime('estimated_departure')->nullable();
            $table->dateTime('departure_date')->nullable();
            $table->foreignId('vessel_id')->constrained('vessels', 'vessel_id');
            $table->foreignId('dock_id')->constrained('docks', 'dock_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('port_calls');
    }
};
