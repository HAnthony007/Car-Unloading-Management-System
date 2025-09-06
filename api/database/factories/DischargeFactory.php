<?php

namespace Database\Factories;

use App\Models\Discharge;
use App\Models\PortCall;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Discharge>
 */
class DischargeFactory extends Factory
{
    protected $model = Discharge::class;

    public function definition(): array
    {
        return [
            'discharge_timestamp' => fake()->dateTimeBetween('-5 days', '+1 day'),
            'status' => 'pending',
            'port_call_id' => PortCall::factory(),
            'vehicle_id' => Vehicle::factory(),
            'agent_id' => User::factory(),
        ];
    }
}
