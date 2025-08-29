<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table): void {
            if (! Schema::hasColumn('vehicles', 'owner_name')) {
                $table->string('owner_name')->nullable()->after('year');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table): void {
            if (Schema::hasColumn('vehicles', 'owner_name')) {
                $table->dropColumn('owner_name');
            }
        });
    }
};
