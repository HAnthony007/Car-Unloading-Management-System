<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('port_calls', function (Blueprint $table) {
            if (! Schema::hasColumn('port_calls', 'vehicles_number')) {
                $table->unsignedInteger('vehicles_number')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('port_calls', function (Blueprint $table) {
            if (Schema::hasColumn('port_calls', 'vehicles_number')) {
                $table->dropColumn('vehicles_number');
            }
        });
    }
};
