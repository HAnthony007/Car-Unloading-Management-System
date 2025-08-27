<?php

use App\Models\Role as EloquentRole;
use App\Models\User as EloquentUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->role = EloquentRole::factory()->create([
        'role_name' => 'User',
        'role_description' => 'Regular user',
    ]);

    $this->user = EloquentUser::factory()->create([
        'role_id' => $this->role->role_id,
        'email_verified_at' => now(),
    ]);

    Sanctum::actingAs($this->user);
});

it('lists all roles', function () {
    EloquentRole::factory()->create(['role_name' => 'Admin']);
    EloquentRole::factory()->create(['role_name' => 'Manager']);

    $response = $this->getJson('/api/roles');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'role_id',
                    'role_name',
                    'display_name',
                    'role_description',
                    'has_description',
                    'permissions' => [
                        'is_administrator',
                        'can_manage_users',
                        'can_vew_reports',
                    ],
                    'created_at',
                    'updated_at',
                ],
            ],
        ]);

    expect(count($response->json('data')))->toBeGreaterThanOrEqual(3);
});

it('creates a role successfully', function () {
    $payload = [
        'role_name' => 'Supervisor',
        'role_description' => 'Oversees operations',
    ];

    $response = $this->postJson('/api/roles', $payload);

    $response->assertStatus(201)
        ->assertJsonPath('data.role_name', 'Supervisor')
        ->assertJsonPath('data.display_name', 'Supervisor');

    $this->assertDatabaseHas('roles', [
        'role_name' => 'Supervisor',
    ]);
});

it('validates required fields when creating', function () {
    $response = $this->postJson('/api/roles', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['role_name']);
});

it('shows a role by id', function () {
    $role = EloquentRole::factory()->create(['role_name' => 'Viewer']);

    $response = $this->getJson('/api/roles/'.$role->role_id);

    $response->assertStatus(200)
        ->assertJsonPath('data.role_name', 'Viewer');
});

it('updates a role', function () {
    $role = EloquentRole::factory()->create(['role_name' => 'TempRole']);

    $payload = [
        'role_name' => 'UpdatedRole',
        'role_description' => 'Updated desc',
    ];

    $response = $this->putJson('/api/roles/'.$role->role_id, $payload);

    $response->assertStatus(200)
        ->assertJsonPath('data.role_name', 'UpdatedRole');

    $this->assertDatabaseHas('roles', [
        'role_name' => 'UpdatedRole',
    ]);
});

it('deletes a role', function () {
    $role = EloquentRole::factory()->create(['role_name' => 'ToDelete']);

    $response = $this->deleteJson('/api/roles/'.$role->role_id);

    $response->assertStatus(204);

    $this->assertDatabaseMissing('roles', [
        'role_name' => 'ToDelete',
    ]);
});
