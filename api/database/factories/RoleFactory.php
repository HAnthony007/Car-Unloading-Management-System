<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'role_id' => fake()->unique()->numberBetween(1, 1000),
            'role_name' => fake()->randomElement(['User', 'Admin', 'Manager', 'Supervisor']),
            'role_description' => fake()->sentence(),
        ];
    }
}
