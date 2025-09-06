<?php

namespace Database\Factories;

use App\Models\Discharge;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Survey>
 */
class SurveyFactory extends Factory
{
    protected $model = Survey::class;

    public function definition(): array
    {
        return [
            'survey_date' => fake()->dateTimeBetween('-5 days', 'now'),
            'overall_status' => fake()->randomElement(['PASSED', 'FAILED', 'PENDING']),
            'agent_id' => fn () => User::query()->inRandomOrder()->value('user_id') ?? User::factory(),
            // ensure uniqueness since surveys table requires unique discharge_id
            'discharge_id' => Discharge::factory(),
        ];
    }
}
