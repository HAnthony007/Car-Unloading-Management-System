<?php

namespace Database\Factories;

use App\Models\SurveyTemplate;
use App\Models\SurveyTemplateCheckpoint;
use Illuminate\Database\Eloquent\Factories\Factory;

class SurveyTemplateCheckpointFactory extends Factory
{
    protected $model = SurveyTemplateCheckpoint::class;

    public function definition(): array
    {
        return [
            'survey_template_id' => SurveyTemplate::factory(),
            'title_checkpoint' => $this->faker->sentence(3),
            'description_checkpoint' => $this->faker->sentence(),
            'default_result_checkpoint' => null,
            'order_checkpoint' => $this->faker->numberBetween(1, 10),
            'active' => true,
        ];
    }
}
