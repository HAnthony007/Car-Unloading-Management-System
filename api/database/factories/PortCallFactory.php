<?php

namespace Database\Factories;

use App\Models\Dock;
use App\Models\PortCall;
use App\Models\Vessel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PortCall>
 */
class PortCallFactory extends Factory
{
    protected $model = PortCall::class;

    public function definition(): array
    {
        $arrival = fake()->dateTimeBetween('-10 days', '+1 day');
        // estimated_arrival is NOT NULL in schema; always set it
        $eta = fake()->dateTimeBetween('-12 days', $arrival);
        $etd = fake()->boolean(70) ? fake()->dateTimeBetween($arrival, '+10 days') : null;
        $departure = fake()->boolean(60) ? fake()->dateTimeBetween($arrival, '+12 days') : null;

        return [
            'vessel_agent' => fake()->company(),
            'origin_port' => fake()->city(),
            'estimated_arrival' => $eta,
            'arrival_date' => $arrival,
            'estimated_departure' => $etd,
            'departure_date' => $departure,
            'vessel_id' => Vessel::factory(),
            'dock_id' => Dock::factory(),
        ];
    }
}
