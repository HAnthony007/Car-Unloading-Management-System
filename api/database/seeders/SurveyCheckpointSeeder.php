<?php

namespace Database\Seeders;

use App\Models\SurveyCheckpoint;
use Illuminate\Database\Seeder;

class SurveyCheckpointSeeder extends Seeder
{
    public function run(): void
    {
        SurveyCheckpoint::factory()->count(5)->create();
    }
}
