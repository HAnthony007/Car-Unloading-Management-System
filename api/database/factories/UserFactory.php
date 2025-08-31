<?php

namespace Database\Factories;

use App\Models\Role;
use Database\Factories\Providers\MalagasyPersonProvider;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Register Malagasy provider once per factory instance
        if (! collect($this->faker->getProviders())->first(fn ($p) => $p instanceof MalagasyPersonProvider)) {
            $this->faker->addProvider(new MalagasyPersonProvider($this->faker));
        }

        return [
            'matriculation_no' => 'USER'.fake()->unique()->numberBetween(1000, 9999),
            'full_name' => $this->faker->malagasyFullName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role_id' => Role::factory(),
            'phone' => $this->faker->malagasyPhone(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
