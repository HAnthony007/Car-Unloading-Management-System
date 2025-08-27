<?php

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use function Pest\Laravel\{actingAs, getJson, postJson, putJson, deleteJson};

uses(RefreshDatabase::class);

it('allows an authenticated user to create, show, update and delete a vessel', function () {
    // Ensure the vessels table exists for this test
    if (!Schema::hasTable('vessels')) {
        Schema::create('vessels', function (Blueprint $table) {
            $table->id('vessel_id');
            $table->string('imo_no')->unique();
            $table->string('vessel_name');
            $table->string('flag');
            $table->timestamps();
        });
    }

    // Create test user and token
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    // Authenticate as Sanctum user
    actingAs($user, 'sanctum');

    // Create vessel
    $createData = [
        'imo_no' => '1234567',
        'vessel_name' => 'Evergreen',
        'flag' => 'Panama',
    ];

    $response = postJson('/api/vessels', $createData);
    // debug: dump response if not created
    if ($response->status() !== 201) {
        $response->dump();
    }

    $response->assertCreated()
        ->assertJsonStructure([
            'message',
            'data' => [
                'vessel_id',
                'imo_no',
                'vessel_name',
                'flag',
                'created_at',
                'updated_at',
            ]
        ]);

    $vesselId = $response->json('data.vessel_id');

    // Show vessel
    $response = getJson("/api/vessels/{$vesselId}");

    $response->assertSuccessful()
        ->assertJsonFragment([
            'imo_no' => '1234567',
            'vessel_name' => 'Evergreen',
            'flag' => 'Panama',
        ]);

    // Update vessel
    $updateData = [
        'vessel_name' => 'Evergreen II',
        'flag' => 'Liberia',
    ];

    $response = putJson("/api/vessels/{$vesselId}", $updateData);

    $response->assertSuccessful()
        ->assertJsonFragment([
            'vessel_name' => 'Evergreen II',
            'flag' => 'Liberia',
        ]);

    // Delete vessel
    $response = deleteJson("/api/vessels/{$vesselId}");

    $response->assertSuccessful()
        ->assertJsonFragment([
            'message' => 'Vessel deleted successfully.',
        ]);

    // List vessels should be empty
    $response = getJson('/api/vessels');

    $response->assertSuccessful()
        ->assertJson([]);
});

it('validates payload when creating a vessel and enforces unique IMO', function () {
    if (!Schema::hasTable('vessels')) {
        Schema::create('vessels', function (Blueprint $table) {
            $table->id('vessel_id');
            $table->string('imo_no')->unique();
            $table->string('vessel_name');
            $table->string('flag');
            $table->timestamps();
        });
    }

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    // Missing imo_no
    $response = postJson('/api/vessels', [
        'vessel_name' => 'A',
        'flag' => 'B',
    ]);
    $response->assertStatus(422)
        ->assertJsonStructure(['message', 'errors' => ['imo_no']]);

    // Invalid IMO format
    $response = postJson('/api/vessels', [
        'imo_no' => '123',
        'vessel_name' => 'A',
        'flag' => 'B',
    ]);
    $response->assertStatus(422)
        ->assertJsonStructure(['message', 'errors' => ['imo_no']]);

    // Create a valid vessel
    postJson('/api/vessels', [
        'imo_no' => '7654321',
        'vessel_name' => 'Alpha',
        'flag' => 'FR',
    ])->assertCreated();

    // Duplicate IMO should fail validation (same raw value)
    postJson('/api/vessels', [
        'imo_no' => '7654321',
        'vessel_name' => 'Beta',
        'flag' => 'FR',
    ])->assertStatus(422)
      ->assertJsonStructure(['message', 'errors' => ['imo_no']]);
});

it('returns 404 for non-existing vessel on show/update/delete', function () {
    if (!Schema::hasTable('vessels')) {
        Schema::create('vessels', function (Blueprint $table) {
            $table->id('vessel_id');
            $table->string('imo_no')->unique();
            $table->string('vessel_name');
            $table->string('flag');
            $table->timestamps();
        });
    }

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    getJson('/api/vessels/999')->assertNotFound();
    putJson('/api/vessels/999', ['vessel_name' => 'X'])->assertNotFound();
    deleteJson('/api/vessels/999')->assertNotFound();
});

it('rejects unauthenticated access to vessels endpoints', function () {
    if (!Schema::hasTable('vessels')) {
        Schema::create('vessels', function (Blueprint $table) {
            $table->id('vessel_id');
            $table->string('imo_no')->unique();
            $table->string('vessel_name');
            $table->string('flag');
            $table->timestamps();
        });
    }

    postJson('/api/vessels', ['imo_no' => '1234567', 'vessel_name' => 'A', 'flag' => 'B'])->assertUnauthorized();
    getJson('/api/vessels')->assertUnauthorized();
});
