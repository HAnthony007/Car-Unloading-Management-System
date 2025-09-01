<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('port_calls', function (Blueprint $table) {
            // Drop FK to alter nullability, then recreate
            if (Schema::hasColumn('port_calls', 'dock_id')) {
                $table->dropConstrainedForeignId('dock_id');
            }
        });

        Schema::table('port_calls', function (Blueprint $table) {
            $table->foreignId('dock_id')->nullable()->constrained('docks', 'dock_id');
        });
    }

    public function down(): void
    {
        Schema::table('port_calls', function (Blueprint $table) {
            $table->dropConstrainedForeignId('dock_id');
            $table->foreignId('dock_id')->constrained('docks', 'dock_id');
        });
    }
};
