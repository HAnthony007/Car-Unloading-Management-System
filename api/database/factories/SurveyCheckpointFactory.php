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
            'title_checkpoint' => fake()->sentence(3),
            'comment_checkpoint' => fake()->optional()->sentence(),
            'description_checkpoint' => fake()->optional()->paragraph(),
            // Start unset (null). Result will be filled later by inspection process.
            'result_checkpoint' => null,
            'order_checkpoint' => fake()->optional()->numberBetween(1, 10),
            'survey_id' => Survey::factory(),
        ];
    }
}
