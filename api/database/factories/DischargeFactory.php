<?php

namespace Database\Factories;

use App\Models\Discharge;
use App\Models\PortCall;
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
            'discharge_date' => fake()->dateTimeBetween('-5 days', '+1 day'),
            'port_call_id' => PortCall::factory(),
        ];
    }
}
