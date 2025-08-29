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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id('vehicle_id');
            $table->string('vin')->unique();
            $table->string('make');
            $table->string('model');
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('owner_name')->nullable();
            $table->string('color')->nullable();
            $table->string('type');
            $table->string('weight');
            $table->string('vehicle_condition'); // Occasion neuf etc
            $table->string('vehicle_observation')->nullable();
            $table->string('origin_country');
            $table->string('ship_location')->nullable();
            $table->boolean('is_primed')->default(false);
            $table->foreignId('discharge_id')->nullable()->constrained('discharges', 'discharge_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
