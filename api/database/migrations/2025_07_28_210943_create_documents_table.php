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
        Schema::create('documents', function (Blueprint $table) {
            $table->id('document_id');
            $table->string('document_path');
            $table->string('document_description');
            $table->string('type');
            $table->dateTime('uploaded_at');
            $table->foreignId('port_call_id')->constrained('port_calls', 'port_call_id');
            $table->foreignId('follow_up_file_id')->nullable()->constrained('follow_up_files', 'follow_up_file_id')->nullOnDelete();
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles', 'vehicle_id')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
