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

function ensure_vehicle_schema(): void
{
    if (! Schema::hasTable('discharges')) {
        Schema::create('discharges', function (Blueprint $table) {
            $table->id('discharge_id');
            $table->timestamp('discharge_date')->nullable();
            $table->unsignedBigInteger('port_call_id')->nullable();
            $table->timestamps();
        });
    }
    if (! Schema::hasTable('vehicles')) {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id('vehicle_id');
            $table->string('vin')->unique();
            $table->string('make');
            $table->string('model');
            $table->string('color')->nullable();
            $table->string('type');
            $table->string('weight');
            $table->string('vehicle_condition');
            $table->string('vehicle_observation')->nullable();
            $table->string('origin_country');
            $table->string('ship_location')->nullable();
            $table->boolean('is_primed')->default(false);
            $table->unsignedBigInteger('discharge_id');
            $table->timestamps();
        });
    }
}

it('creates, shows, updates, deletes and searches vehicles (auth required)', function () {
    ensure_vehicle_schema();

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    // Seed vessel and dock required by port_calls
    $vesselId = DB::table('vessels')->insertGetId([
        'imo_no' => '1111111',
        'vessel_name' => 'Test Vessel',
        'flag' => 'FR',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'vessel_id');
    $dockId = DB::table('docks')->insertGetId([
        'dock_name' => 'Dock 1',
        'location' => 'Zone 1',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'dock_id');

    // Seed a port call to satisfy discharge FK
    $portCallId = DB::table('port_calls')->insertGetId([
        'vessel_agent' => 'Agent T',
        'origin_port' => 'Origin',
        'estimated_arrival' => null,
        'arrival_date' => now(),
        'estimated_departure' => null,
        'departure_date' => null,
        'vessel_id' => $vesselId,
        'dock_id' => $dockId,
        'created_at' => now(),
        'updated_at' => now(),
    ], 'port_call_id');

    // Seed a discharge row linked to the port call
    $dischargeId = DB::table('discharges')->insertGetId([
        'discharge_date' => now(),
        'port_call_id' => $portCallId,
        'created_at' => now(),
        'updated_at' => now(),
    ], 'discharge_id');

    // Create vehicle
    $payload = [
        'vin' => 'abc12345',
        'make' => 'Toyota',
        'model' => 'Corolla',
        'color' => 'Blue',
        'type' => 'Sedan',
        'weight' => '1200kg',
        'vehicle_condition' => 'Neuf',
        'vehicle_observation' => 'None',
        'origin_country' => 'JP',
        'ship_location' => 'Hold A',
        'is_primed' => true,
        'discharge_id' => $dischargeId,
    ];

    $resp = postJson('/api/vehicles', $payload);
    if ($resp->status() !== 201) {
        $resp->dump();
    }
    $resp->assertCreated()->assertJsonStructure([
        'message',
        'data' => [
            'vehicle_id', 'vin', 'make', 'model', 'color', 'type', 'weight',
            'vehicle_condition', 'vehicle_observation', 'origin_country', 'ship_location',
            'is_primed', 'discharge_id', 'created_at', 'updated_at',
        ],
    ]);

    $vehicleId = $resp->json('data.vehicle_id');

    // Show
    getJson("/api/vehicles/{$vehicleId}")
        ->assertSuccessful()
        ->assertJsonFragment(['vin' => 'ABC12345', 'make' => 'Toyota']);

    // Update
    putJson("/api/vehicles/{$vehicleId}", [
        'color' => 'Red',
        'is_primed' => false,
    ])->assertSuccessful()->assertJsonFragment(['color' => 'Red', 'is_primed' => false]);

    // Search
    getJson('/api/vehicles?make=toy&page=1&per_page=10')
        ->assertSuccessful()
        ->assertJsonStructure(['data', 'meta' => ['current_page', 'per_page', 'total']]);

    // Delete
    deleteJson("/api/vehicles/{$vehicleId}")->assertSuccessful()
        ->assertJsonFragment(['message' => 'Vehicle deleted successfully.']);
});

it('validates payload and unique vin, and rejects invalid discharge', function () {
    ensure_vehicle_schema();

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    // Missing vin
    postJson('/api/vehicles', [])->assertStatus(422)->assertJsonStructure(['errors' => ['vin']]);

    // Invalid discharge should be rejected by domain check (controller returns 400)
    postJson('/api/vehicles', [
        'vin' => 'X12345',
        'make' => 'A', 'model' => 'B', 'type' => 'C', 'weight' => '10kg', 'vehicle_condition' => 'Neuf', 'origin_country' => 'FR',
        'discharge_id' => 99999,
    ])->assertStatus(400);

    // Insert discharge with valid port_call
    $vesselId = DB::table('vessels')->insertGetId([
        'imo_no' => '2222222',
        'vessel_name' => 'Alpha',
        'flag' => 'US',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'vessel_id');
    $dockId = DB::table('docks')->insertGetId([
        'dock_name' => 'Dock A',
        'location' => 'Zone A',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'dock_id');
    $portCallId = DB::table('port_calls')->insertGetId([
        'vessel_agent' => 'Agent A',
        'origin_port' => 'P1',
        'estimated_arrival' => null,
        'arrival_date' => now(),
        'estimated_departure' => null,
        'departure_date' => null,
        'vessel_id' => $vesselId,
        'dock_id' => $dockId,
        'created_at' => now(),
        'updated_at' => now(),
    ], 'port_call_id');
    $dischargeId = DB::table('discharges')->insertGetId([
        'discharge_date' => now(),
        'port_call_id' => $portCallId,
        'created_at' => now(),
        'updated_at' => now(),
    ], 'discharge_id');

    // Create valid
    postJson('/api/vehicles', [
        'vin' => 'uniqVIN',
        'make' => 'M', 'model' => 'N', 'type' => 'T', 'weight' => '100', 'vehicle_condition' => 'Occasion', 'origin_country' => 'DE',
        'discharge_id' => $dischargeId,
    ])->assertCreated();

    // Duplicate vin
    postJson('/api/vehicles', [
        'vin' => 'uniqVIN',
        'make' => 'M', 'model' => 'N', 'type' => 'T', 'weight' => '100', 'vehicle_condition' => 'Occasion', 'origin_country' => 'DE',
        'discharge_id' => $dischargeId,
    ])->assertStatus(422)->assertJsonStructure(['errors' => ['vin']]);
});

it('rejects unauthenticated access to vehicles endpoints', function () {
    ensure_vehicle_schema();
    postJson('/api/vehicles', ['vin' => 'A', 'make' => 'B', 'model' => 'C', 'type' => 'D', 'weight' => '1', 'vehicle_condition' => 'X', 'origin_country' => 'Y', 'discharge_id' => 1])
        ->assertUnauthorized();
    getJson('/api/vehicles')->assertUnauthorized();
});
