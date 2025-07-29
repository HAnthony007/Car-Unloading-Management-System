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
            $table->string('plate_number')->nullable();
            $table->string('make');
            $table->string('model');
            $table->string('color')->nullable();
            $table->boolean('is_primed')->default(false);
            $table->foreignId('discharge_id')->constrained('discharges', 'discharge_id');
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
