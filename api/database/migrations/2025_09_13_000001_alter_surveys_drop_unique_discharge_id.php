<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('surveys')) {
            return;
        }
        $connection = Schema::getConnection();
        // If sqlite, the fresh create migration no longer has the unique, so skip silently
        if ($connection->getDriverName() === 'sqlite') {
            return;
        }
        try {
            $hasIndex = collect($connection->select('SHOW INDEX FROM surveys'))
                ->contains(fn ($row) => ($row->Key_name ?? null) === 'surveys_discharge_id_unique');
            if (! $hasIndex) {
                return;
            }
        } catch (\Throwable $e) {
            return; // silently ignore if SHOW INDEX unsupported
        }
        Schema::table('surveys', function (Blueprint $table) {
            try {
                $table->dropUnique('surveys_discharge_id_unique');
            } catch (\Throwable $e) {
            }
        });
    }

    public function down(): void
    {
        Schema::table('surveys', function (Blueprint $table) {
            try {
                $table->unique('discharge_id');
            } catch (\Throwable $e) {
                // Ignore if cannot recreate.
            }
        });
    }
};
