<?php

namespace Database\Factories;

use App\Models\FollowUpFile;
use App\Models\PortCall;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FollowUpFile>
 */
class FollowUpFileFactory extends Factory
{
    protected $model = FollowUpFile::class;

    public function definition(): array
    {
        return [
            'bill_of_lading' => 'BOL'.fake()->bothify('########??'),
            'status' => fake()->randomElement(['OPEN', 'IN_PROGRESS', 'CLOSED']),
            // Prefer an existing vehicle to avoid inflating Vehicle count during seeding
            'vehicle_id' => fn () => Vehicle::query()->inRandomOrder()->value('vehicle_id') ?? Vehicle::factory(),
            'port_call_id' => PortCall::factory(),
        ];
    }
}
