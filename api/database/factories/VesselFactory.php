<?php

namespace Database\Factories;

use App\Models\Vessel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vessel>
 */
class VesselFactory extends Factory
{
    protected $model = Vessel::class;

    public function definition(): array
    {
        return [
            'imo_no' => (string) fake()->randomNumber(7, true),
            'vessel_name' => fake()->company().' Vessel',
            'flag' => fake()->country(),
        ];
    }
}
