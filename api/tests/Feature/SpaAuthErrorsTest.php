<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// Reuse helper from SpaAuthTest
require_once __DIR__.'/SpaAuthTest.php';

it('returns specific error when email does not exist', function (): void {
    // Arrange: only role, no user for provided email
    $role = Role::factory()->create();

    // Act: login with non-existent email but valid format
    $response = \Pest\Laravel\postJson('/api/auth/spa/login', [
        'email' => 'unknown@example.com',
        'password' => 'password',
    ], array_merge([
        'Accept' => 'application/json',
    ], originHeader()));

    // Assert: 422 and email-specific message
    $response->assertStatus(422)
        ->assertJsonPath('message', 'This email address is not registered.')
        ->assertJsonPath('errors.email.0', 'This email address is not registered.');
});

it('returns specific error when password is incorrect', function (): void {
    // Arrange: user exists
    $role = Role::factory()->create();
    /** @var User $user */
    $user = User::factory()->create([
        'role_id' => $role->role_id,
        'password' => bcrypt('correct-password'),
    ]);

    // Act: wrong password
    $response = \Pest\Laravel\postJson('/api/auth/spa/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ], array_merge([
        'Accept' => 'application/json',
    ], originHeader()));

    // Assert
    $response->assertStatus(422)
        ->assertJsonPath('message', 'Incorrect password.')
        ->assertJsonPath('errors.password.0', 'Incorrect password.');
});
