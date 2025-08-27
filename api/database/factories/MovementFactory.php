<?php

namespace Database\Factories;

use App\Models\Movement;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Movement>
 */
class MovementFactory extends Factory
{
    protected $model = Movement::class;

    public function definition(): array
    {
        $from = fake()->optional()->word();
        $to = fake()->optional()->word();
        return [
            'note' => fake()->optional()->sentence(),
            'timestamp' => fake()->dateTimeBetween('-10 days', 'now'),
            'from' => $from,
            'to' => $to,
            'vehicle_id' => Vehicle::factory(),
            'user_id' => User::factory(),
        ];
    }
}
