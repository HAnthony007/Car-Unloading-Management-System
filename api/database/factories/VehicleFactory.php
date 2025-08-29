<?php

namespace Database\Factories;

use App\Models\Discharge;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vehicle>
 */
class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    public function definition(): array
    {
        return [
            'vin' => strtoupper(fake()->bothify('??##############')),
            'make' => fake()->company(),
            'model' => fake()->bothify('Model-##'),
            'year' => fake()->optional()->numberBetween(1980, (int) date('Y') + 1),
            'owner_name' => fake()->optional()->name(),
            'color' => fake()->optional()->safeColorName(),
            'type' => fake()->randomElement(['SUV', 'Sedan', 'Truck', 'Van', 'Coupe']),
            'weight' => (string) fake()->numberBetween(900, 3500).'kg',
            'vehicle_condition' => fake()->randomElement(['Neuf', 'Occasion', 'Endommagé']),
            'vehicle_observation' => fake()->optional()->sentence(),
            'origin_country' => fake()->country(),
            'ship_location' => fake()->optional()->word(),
            'is_primed' => fake()->boolean(20),
            'discharge_id' => Discharge::factory(),
        ];
    }
}
