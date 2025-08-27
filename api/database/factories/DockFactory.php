<?php

namespace Database\Factories;

use App\Models\Dock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Dock>
 */
class DockFactory extends Factory
{
    protected $model = Dock::class;

    public function definition(): array
    {
        return [
            'dock_name' => 'Dock '.fake()->numberBetween(1, 10000),
            'location' => fake()->city(),
        ];
    }
}
