<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('photos', function (Blueprint $table): void {
            if (Schema::hasColumn('photos', 'vehicle_id')) {
                $table->dropForeign(['vehicle_id']);
                $table->dropColumn('vehicle_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('photos', function (Blueprint $table): void {
            if (! Schema::hasColumn('photos', 'vehicle_id')) {
                $table->foreignId('vehicle_id')->nullable()->constrained('vehicles', 'vehicle_id');
            }
        });
    }
};
