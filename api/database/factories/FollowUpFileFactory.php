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
            'status' => fake()->randomElement(['initiated', 'in_progress', 'completed', 'on_hold']),
            'vehicle_id' => Vehicle::factory(),
            'port_call_id' => PortCall::factory(),
        ];
    }
}
