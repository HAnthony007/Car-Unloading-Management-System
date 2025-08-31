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
        // Occasionally choose Mahasarika to exercise conditional logic
        $to = fake()->boolean(30) ? 'Mahasarika' : fake()->optional()->word();
        $parkingNumber = $to === 'Mahasarika' ? ('P'.str_pad((string) fake()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT)) : null;

        return [
            'note' => fake()->optional()->sentence(),
            'timestamp' => fake()->dateTimeBetween('-10 days', 'now'),
            'from' => $from,
            'to' => $to,
            'parking_number' => $parkingNumber,
            // Prefer existing to avoid inflating counts during seeding
            'vehicle_id' => fn () => Vehicle::query()->inRandomOrder()->value('vehicle_id') ?? Vehicle::factory(),
            'user_id' => fn () => User::query()->inRandomOrder()->value('user_id') ?? User::factory(),
        ];
    }
}
