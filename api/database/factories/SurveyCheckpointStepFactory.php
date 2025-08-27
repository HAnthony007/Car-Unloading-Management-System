<?php

namespace Database\Factories;

use App\Models\SurveyCheckpoint;
use App\Models\SurveyCheckpointStep;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SurveyCheckpointStep>
 */
class SurveyCheckpointStepFactory extends Factory
{
    protected $model = SurveyCheckpointStep::class;

    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-2 days', 'now');
        return [
            'step_name' => fake()->word(),
            'step_status' => fake()->randomElement(['pending', 'running', 'done', 'failed']),
            'step_started_at' => $start,
            'step_finished_at' => fake()->optional(0.6)->dateTimeBetween($start, '+1 day'),
            'survey_checkpoint_id' => SurveyCheckpoint::factory(),
        ];
    }
}
