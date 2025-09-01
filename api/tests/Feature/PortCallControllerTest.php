<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);

function ensurePortCallRelatedTables(): void
{
    if (! Schema::hasTable('vessels')) {
        Schema::create('vessels', function (Blueprint $table) {
            $table->id('vessel_id');
            $table->string('imo_no')->unique();
            $table->string('vessel_name');
            $table->string('flag');
            $table->timestamps();
        });
    }

    if (! Schema::hasTable('docks')) {
        Schema::create('docks', function (Blueprint $table) {
            $table->id('dock_id');
            $table->string('dock_name');
            $table->string('location');
            $table->timestamps();
        });
    }

    if (! Schema::hasTable('port_calls')) {
        Schema::create('port_calls', function (Blueprint $table) {
            $table->id('port_call_id');
            $table->string('vessel_agent');
            $table->string('origin_port');
            $table->dateTime('estimated_arrival');
            $table->dateTime('arrival_date');
            $table->dateTime('estimated_departure')->nullable();
            $table->dateTime('departure_date')->nullable();
            $table->foreignId('vessel_id')->constrained('vessels', 'vessel_id');
            $table->foreignId('dock_id')->constrained('docks', 'dock_id');
            $table->timestamps();
        });
    }
}

it('allows an authenticated user to create, show, update and delete a port call', function () {
    ensurePortCallRelatedTables();

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    // Seed vessel and dock
    $vesselId = DB::table('vessels')->insertGetId([
        'imo_no' => '1234567',
        'vessel_name' => 'Evergreen',
        'flag' => 'Panama',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'vessel_id');
    $dockId = DB::table('docks')->insertGetId([
        'dock_name' => 'Main Dock',
        'location' => 'Port Area',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'dock_id');

    // Create port call
    $createData = [
        'vessel_agent' => 'Agent X',
        'origin_port' => 'Marseille',
        'estimated_arrival' => '2025-08-01 10:00:00',
        'arrival_date' => '2025-08-02 12:00:00',
        'vessel_id' => $vesselId,
        'dock_id' => $dockId,
    ];

    $response = postJson('/api/port-calls', $createData);
    if ($response->status() !== 201) {
        $response->dump();
    }
    $response->assertCreated()
        ->assertJsonStructure([
            'message',
            'data' => [
                'port_call_id', 'vessel_agent', 'origin_port',
                'estimated_arrival', 'arrival_date', 'estimated_departure', 'departure_date',
                'vessel_id', 'dock_id', 'created_at', 'updated_at',
            ],
        ]);

    $id = $response->json('data.port_call_id');

    // Show
    getJson("/api/port-calls/{$id}")
        ->assertSuccessful()
        ->assertJsonFragment([
            'vessel_agent' => 'Agent X',
            'origin_port' => 'Marseille',
            'vessel_id' => $vesselId,
            'dock_id' => $dockId,
        ]);

    // Update
    $updateData = [
        'origin_port' => 'Rotterdam',
        'estimated_departure' => '2025-08-03 08:00:00',
    ];
    putJson("/api/port-calls/{$id}", $updateData)
        ->assertSuccessful()
        ->assertJsonFragment([
            'origin_port' => 'Rotterdam',
        ]);

    // Delete
    deleteJson("/api/port-calls/{$id}")
        ->assertSuccessful()
        ->assertJsonFragment(['message' => 'Port call deleted successfully.']);

    // Index should be empty
    getJson('/api/port-calls')->assertSuccessful()->assertJson([]);
});

it('validates payload when creating a port call', function () {
    ensurePortCallRelatedTables();

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    // Need existing vessel and dock for exists rules
    $vesselId = DB::table('vessels')->insertGetId([
        'imo_no' => '7654321',
        'vessel_name' => 'Alpha',
        'flag' => 'FR',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'vessel_id');
    $dockId = DB::table('docks')->insertGetId([
        'dock_name' => 'Dock A',
        'location' => 'Zone A',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'dock_id');

    // Missing required fields
    postJson('/api/port-calls', [
        'origin_port' => 'X',
        'arrival_date' => '2025-08-01 00:00:00',
        'vessel_id' => $vesselId,
        'dock_id' => $dockId,
    ])->assertStatus(422)->assertJsonStructure(['message', 'errors' => ['vessel_agent']]);

    // departure_date before arrival_date
    postJson('/api/port-calls', [
        'vessel_agent' => 'A',
        'origin_port' => 'B',
        'arrival_date' => '2025-08-05 00:00:00',
        'departure_date' => '2025-08-04 00:00:00',
        'vessel_id' => $vesselId,
        'dock_id' => $dockId,
    ])->assertStatus(422)->assertJsonStructure(['message', 'errors' => ['departure_date']]);

    // Non-existing foreign keys
    postJson('/api/port-calls', [
        'vessel_agent' => 'A',
        'origin_port' => 'B',
        'arrival_date' => '2025-08-05 00:00:00',
        'vessel_id' => 999999,
        'dock_id' => 999999,
    ])->assertStatus(422)->assertJsonStructure(['message', 'errors' => ['vessel_id', 'dock_id']]);
});

it('returns 404 for non-existing port call on show/update/delete', function () {
    ensurePortCallRelatedTables();

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    getJson('/api/port-calls/999')->assertNotFound();
    putJson('/api/port-calls/999', ['origin_port' => 'X'])->assertNotFound();
    deleteJson('/api/port-calls/999')->assertNotFound();
});

it('rejects unauthenticated access to port call endpoints', function () {
    ensurePortCallRelatedTables();

    postJson('/api/port-calls', [
        'vessel_agent' => 'Agent',
        'origin_port' => 'X',
        'arrival_date' => '2025-08-02 00:00:00',
        'vessel_id' => 1,
        'dock_id' => 1,
    ])->assertUnauthorized();

    getJson('/api/port-calls')->assertUnauthorized();
});
