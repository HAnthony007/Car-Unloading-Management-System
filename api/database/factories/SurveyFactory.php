<?php

namespace Database\Factories;

use App\Models\FollowUpFile;
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
            'date' => fake()->date(),
            'result' => fake()->randomElement(['OK', 'KO', 'Pending']),
            'user_id' => User::factory(),
            'follow_up_file_id' => FollowUpFile::factory(),
        ];
    }
}
