<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movements', function (Blueprint $table) {
            $table->decimal('from_latitude', 10, 7)->nullable()->after('from');
            $table->decimal('from_longitude', 10, 7)->nullable()->after('from_latitude');
            $table->decimal('to_latitude', 10, 7)->nullable()->after('to');
            $table->decimal('to_longitude', 10, 7)->nullable()->after('to_latitude');
        });
    }

    public function down(): void
    {
        Schema::table('movements', function (Blueprint $table) {
            $table->dropColumn(['from_latitude', 'from_longitude', 'to_latitude', 'to_longitude']);
        });
    }
};
