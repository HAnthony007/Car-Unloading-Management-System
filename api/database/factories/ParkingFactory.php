<?php

namespace Database\Factories;

use App\Models\Parking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Parking>
 */
class ParkingFactory extends Factory
{
    protected $model = Parking::class;

    public function definition(): array
    {
        return [
            'parking_name' => 'Parking '.fake()->unique()->numberBetween(1, 200),
            'location' => fake()->streetAddress(),
            'capacity' => fake()->numberBetween(20, 500),
            'parking_number' => fake()->optional()->bothify('P-###'),
        ];
    }
}
