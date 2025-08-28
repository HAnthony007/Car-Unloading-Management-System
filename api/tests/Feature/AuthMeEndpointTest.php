<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

// Using fully-qualified Pest helpers to avoid static analysis issues

uses(RefreshDatabase::class);

it('returns the authenticated user resource on /auth/me', function (): void {
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);

    Sanctum::actingAs($user);

    $response = \Pest\Laravel\getJson('/api/auth/me');

    $response->assertSuccessful()
        ->assertJsonStructure([
            'message',
            'data' => [
                'user' => [
                    'user_id',
                    'matriculation_number',
                    'full_name',
                    'email',
                ],
            ],
        ]);

    // Ensure it is the right user by comparing email
    expect($response->json('data.user.email'))->toBe($user->email);
});

it('returns 401 when unauthenticated on /auth/me', function (): void {
    \Pest\Laravel\getJson('/api/auth/me')->assertUnauthorized();
});
