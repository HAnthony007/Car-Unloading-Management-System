<?php

use App\Models\Role;
use App\Models\User as EloquentUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('updates user role via PUT /api/users/{id}', function () {
    $roleUser = Role::factory()->create(['role_name' => 'User']);
    $roleAdmin = Role::factory()->create(['role_name' => 'Admin']);

    $actor = EloquentUser::factory()->create([
        'role_id' => $roleAdmin->role_id,
        'email_verified_at' => now(),
    ]);
    Sanctum::actingAs($actor);

    $target = EloquentUser::factory()->create([
        'role_id' => $roleUser->role_id,
        'email_verified_at' => now(),
    ]);

    $response = \Pest\Laravel\putJson('/api/users/' . $target->user_id, [
        'role_id' => $roleAdmin->role_id,
    ]);

    $response->assertStatus(200)
        ->assertJsonPath('data.role_id', $roleAdmin->role_id);

    \Pest\Laravel\assertDatabaseHas('users', [
        'user_id' => $target->user_id,
        'role_id' => $roleAdmin->role_id,
    ]);
});

it('validates role exists when updating via PUT /api/users/{id}', function () {
    $roleUser = Role::factory()->create(['role_name' => 'User']);

    $actor = EloquentUser::factory()->create([
        'role_id' => $roleUser->role_id,
        'email_verified_at' => now(),
    ]);
    Sanctum::actingAs($actor);

    $target = EloquentUser::factory()->create([
        'role_id' => $roleUser->role_id,
        'email_verified_at' => now(),
    ]);

    $response = \Pest\Laravel\putJson('/api/users/' . $target->user_id, [
        'role_id' => 999999,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['role_id']);
});
