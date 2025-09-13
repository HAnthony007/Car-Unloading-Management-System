<?php

namespace Database\Factories;

use App\Models\SurveyTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

class SurveyTemplateFactory extends Factory
{
    protected $model = SurveyTemplate::class;

    public function definition(): array
    {
        return [
            'template_key' => $this->faker->unique()->slug(2),
            'name' => $this->faker->sentence(2),
            'description' => $this->faker->sentence(),
            'default_overall_status' => 'PENDING',
            'active' => true,
            'created_by' => null,
        ];
    }
}
