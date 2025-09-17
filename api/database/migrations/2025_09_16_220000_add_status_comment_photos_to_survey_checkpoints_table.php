<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('survey_checkpoints', function (Blueprint $table) {
            // Keep schema canonical: comment is stored in comment_checkpoint and status in result_checkpoint.
            // We only add a JSON column to store photos as required by features/tests.
            if (! Schema::hasColumn('survey_checkpoints', 'photos')) {
                $table->json('photos')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('survey_checkpoints', function (Blueprint $table) {
            if (Schema::hasColumn('survey_checkpoints', 'photos')) {
                $table->dropColumn('photos');
            }
        });
    }
};
