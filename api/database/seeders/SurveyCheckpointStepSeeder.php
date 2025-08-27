<?php

namespace Database\Seeders;

use App\Models\SurveyCheckpointStep;
use Illuminate\Database\Seeder;

class SurveyCheckpointStepSeeder extends Seeder
{
    public function run(): void
    {
        SurveyCheckpointStep::factory()->count(60)->create();
    }
}
