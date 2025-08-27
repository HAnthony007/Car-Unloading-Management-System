<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

it('allows an authenticated user to create, show, update and delete a dock', function () {
    // Ensure the docks table exists for this test
    if (! Schema::hasTable('docks')) {
        Schema::create('docks', function (Blueprint $table) {
            $table->id('dock_id');
            $table->string('dock_name', 100);
            $table->string('location', 255);
            $table->timestamps();
        });
    }

    // Create test user and token
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    // Authenticate as Sanctum user
    $this->actingAs($user, 'sanctum');

    // Create dock
    $createData = [
        'dock_name' => 'Dock Alpha',
        'location' => 'North Pier',
    ];

    $response = $this->postJson('/api/docks', $createData);

    $response->assertCreated()
        ->assertJsonStructure([
            'message',
            'data' => [
                'dock_id',
                'dock_name',
                'location',
                'created_at',
                'updated_at',
            ],
        ]);

    $dockId = $response->json('data.dock_id');

    // Show dock
    $response = $this->getJson("/api/docks/{$dockId}");

    $response->assertSuccessful()
        ->assertJsonFragment([
            'dock_name' => 'Dock Alpha',
            'location' => 'North Pier',
        ]);

    // Update dock
    $updateData = [
        'dock_name' => 'Dock Beta',
        'location' => 'South Pier',
    ];

    $response = $this->putJson("/api/docks/{$dockId}", $updateData);

    $response->assertSuccessful()
        ->assertJsonFragment([
            'dock_name' => 'Dock Beta',
            'location' => 'South Pier',
        ]);

    // Delete dock
    $response = $this->deleteJson("/api/docks/{$dockId}");

    $response->assertSuccessful()
        ->assertJsonFragment([
            'message' => 'Dock deleted successfully.',
        ]);

    // List docks should be empty
    $response = $this->getJson('/api/docks');

    $response->assertSuccessful()
        ->assertJson([]);
});

it('validates payload when creating a dock', function () {
    if (! Schema::hasTable('docks')) {
        Schema::create('docks', function (Blueprint $table) {
            $table->id('dock_id');
            $table->string('dock_name', 100);
            $table->string('location', 255);
            $table->timestamps();
        });
    }

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    $this->actingAs($user, 'sanctum');

    // Missing dock_name
    $response = $this->postJson('/api/docks', [
        'location' => 'Somewhere',
    ]);

    $response->assertStatus(422)
        ->assertJsonStructure(['message', 'errors' => ['dock_name']]);
});

it('returns 404 for non-existing dock on show/update/delete', function () {
    if (! Schema::hasTable('docks')) {
        Schema::create('docks', function (Blueprint $table) {
            $table->id('dock_id');
            $table->string('dock_name', 100);
            $table->string('location', 255);
            $table->timestamps();
        });
    }

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    $this->actingAs($user, 'sanctum');

    $this->getJson('/api/docks/999')->assertNotFound();
    $this->putJson('/api/docks/999', ['dock_name' => 'X'])->assertNotFound();
    $this->deleteJson('/api/docks/999')->assertNotFound();
});

it('rejects unauthenticated access', function () {
    if (! Schema::hasTable('docks')) {
        Schema::create('docks', function (Blueprint $table) {
            $table->id('dock_id');
            $table->string('dock_name', 100);
            $table->string('location', 255);
            $table->timestamps();
        });
    }

    $this->postJson('/api/docks', ['dock_name' => 'A', 'location' => 'B'])->assertUnauthorized();
    $this->getJson('/api/docks')->assertUnauthorized();
});
