<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_templates', function (Blueprint $table) {
            $table->id('survey_template_id');
            $table->string('template_key')->unique(); // machine key (externe, documentation)
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('default_overall_status')->default('PENDING');
            $table->boolean('active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        Schema::create('survey_template_checkpoints', function (Blueprint $table) {
            $table->id('survey_template_checkpoint_id');
            $table->unsignedBigInteger('survey_template_id');
            $table->string('title_checkpoint');
            $table->string('description_checkpoint')->nullable();
            $table->string('default_result_checkpoint')->nullable();
            $table->unsignedInteger('order_checkpoint')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->foreign('survey_template_id')
                ->references('survey_template_id')
                ->on('survey_templates')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_template_checkpoints');
        Schema::dropIfExists('survey_templates');
    }
};
