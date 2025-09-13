<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('survey_checkpoints', function (Blueprint $table) {
            // Ensure column exists then alter to nullable string (already string) without default.
            if (Schema::hasColumn('survey_checkpoints', 'result_checkpoint')) {
                $table->string('result_checkpoint')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        // Can't reliably revert to NOT NULL without knowing previous default; leave as nullable.
    }
};
