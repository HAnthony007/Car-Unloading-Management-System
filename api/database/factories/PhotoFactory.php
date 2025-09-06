<?php

namespace Database\Factories;

use App\Models\Discharge;
use App\Models\Photo;
use App\Models\SurveyCheckpoint;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Photo>
 */
class PhotoFactory extends Factory
{
    protected $model = Photo::class;

    public function definition(): array
    {
        return [
            'photo_path' => 'photos/'.fake()->uuid().'.jpg',
            'taken_at' => fake()->dateTimeBetween('-10 days', 'now'),
            'photo_description' => fake()->optional()->sentence(),
            // Updated relationship: photos now belong to a discharge (required) instead of follow_up_file
            'discharge_id' => Discharge::factory(),
            // checkpoint optional linkage
            'checkpoint_id' => SurveyCheckpoint::factory(),
        ];
    }
}
