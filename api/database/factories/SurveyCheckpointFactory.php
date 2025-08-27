<?php

namespace Database\Factories;

use App\Models\Survey;
use App\Models\SurveyCheckpoint;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SurveyCheckpoint>
 */
class SurveyCheckpointFactory extends Factory
{
    protected $model = SurveyCheckpoint::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'comment' => fake()->optional()->sentence(),
            'survey_id' => Survey::factory(),
        ];
    }
}
