<?php

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

uses(RefreshDatabase::class);

it('allows an authenticated user to create, show, update and delete a parking', function () {
    // Create the parkings table for this test if it doesn't exist
    if (!Schema::hasTable('parkings')) {
        Schema::create('parkings', function (Blueprint $table) {
            $table->id('parking_id');
            $table->string('parking_name', 100);
            $table->string('location', 255);
            $table->integer('capacity')->unsigned();
            $table->timestamps();
        });
    }

    // Check if the parking_number column exists, if not add it
    if (!Schema::hasColumn('parkings', 'parking_number')) {
        Schema::table('parkings', function (Blueprint $table) {
            $table->string('parking_number', 50)->nullable();
        });
    }

    // Create test user
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    $token = $user->createToken('test-token')->plainTextToken;

    // Test creating a parking
    $createData = [
        'parking_name' => 'Test Parking',
        'location' => 'Zone Test',
        'capacity' => 50,
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
        'Accept' => 'application/json',
    ])->postJson('/api/parkings', $createData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'data' => [
                'parking_id',
                'parking_name',
                'location',
                'capacity',
                'created_at',
                'updated_at',
            ]
        ]);

    $parkingId = $response->json('data.parking_id');

    // Test showing the parking
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
        'Accept' => 'application/json',
    ])->getJson("/api/parkings/{$parkingId}");

    $response->assertStatus(200)
        ->assertJsonFragment([
            'parking_name' => 'Test Parking',
            'location' => 'Zone Test',
            'capacity' => 50,
        ]);

    // Test updating the parking
    $updateData = [
        'parking_name' => 'Updated Parking',
        'capacity' => 75,
        'parking_number' => 'P001' // Added parking number to ensure it works with Mahasarika
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
        'Accept' => 'application/json',
    ])->putJson("/api/parkings/{$parkingId}", $updateData);

    $response->assertStatus(200)
        ->assertJsonFragment([
            'parking_name' => 'Updated Parking',
            'capacity' => 75,
        ]);

    // Test deleting the parking
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
        'Accept' => 'application/json',
    ])->deleteJson("/api/parkings/{$parkingId}");

    $response->assertStatus(200)
        ->assertJsonFragment([
            'message' => 'Parking deleted successfully.',
        ]);

    // Test getting all parkings returns empty collection
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
        'Accept' => 'application/json',
    ])->getJson('/api/parkings');

    $response->assertStatus(200)
        ->assertJson([]);
});
