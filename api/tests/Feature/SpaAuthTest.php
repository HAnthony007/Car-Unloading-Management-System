<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function originHeader(): array
{
    return ['Origin' => 'http://localhost:5173'];
}

it('authenticates SPA via cookies and can logout', function (): void {
    // Arrange: user with known password
    $role = Role::factory()->create();
    /** @var User $user */
    $user = User::factory()->create([
        'role_id' => $role->role_id,
        'password' => bcrypt('password'),
    ]);

    // Step 2: SPA login with CSRF header / cookies
    $loginResponse = \Pest\Laravel\postJson('/api/auth/spa/login', [
        'email' => $user->email,
        'password' => 'password',
    ], array_merge([
        'Accept' => 'application/json',
    ], originHeader()));

    $loginResponse->assertSuccessful()
        ->assertJsonPath('data.user.email', $user->email);

    // Session cookie is managed automatically in the test environment

    // Step 3: Access protected route using session cookie
    $meResponse = \Pest\Laravel\getJson('/api/auth/me', array_merge([
        'Accept' => 'application/json',
    ], originHeader()));

    $meResponse->assertSuccessful()
        ->assertJsonPath('data.user.email', $user->email);

    // Step 4: Logout (invalidate session)
    $logoutResponse = \Pest\Laravel\postJson('/api/auth/spa/logout', [], array_merge([
        'Accept' => 'application/json',
    ], originHeader()));

    $logoutResponse->assertSuccessful();
});

it('requires authentication for /auth/me when not logged in via SPA', function (): void {
    $response = \Pest\Laravel\getJson('/api/auth/me', array_merge([
        'Accept' => 'application/json',
    ], originHeader()));

    $response->assertStatus(401);
});
