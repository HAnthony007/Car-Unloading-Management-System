<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::factory()->create(['role_id' => 1]);
});

function seed_port_call(): int
{
    $vesselId = DB::table('vessels')->insertGetId([
        'imo_no' => '7894561',
        'vessel_name' => 'Seed Vessel',
        'flag' => 'FR',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'vessel_id');
    $dockId = DB::table('docks')->insertGetId([
        'dock_name' => 'Seed Dock',
        'location' => 'Seed Location',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'dock_id');

    return DB::table('port_calls')->insertGetId([
        'vessel_agent' => 'Agent X',
        'origin_port' => 'Origin X',
        'estimated_arrival' => now(),
        'arrival_date' => now(),
        'estimated_departure' => null,
        'departure_date' => null,
        'vessel_id' => $vesselId,
        'dock_id' => $dockId,
        'created_at' => now(),
        'updated_at' => now(),
    ], 'port_call_id');
}

it('enforces parking capacity (second movement rejected)', function () {
    $user = User::factory()->create(['role_id' => 1]);
    actingAs($user, 'sanctum');

    $portCallId = seed_port_call();

    // Create parking with capacity 1
    $parkingResp = postJson('/api/parkings', [
        'parking_name' => 'CapTest',
        'location' => 'CapTest',
        'capacity' => 1,
    ]);
    $parkingResp->assertCreated();

    // Two vehicles + discharges
    $veh1 = DB::table('vehicles')->insertGetId([
        'vin' => 'CAPVIN1', 'make' => 'M', 'model' => 'M', 'type' => 'T', 'weight' => '1000', 'vehicle_condition' => 'OK', 'origin_country' => 'FR', 'is_primed' => false,
        'created_at' => now(), 'updated_at' => now(),
    ], 'vehicle_id');
    $veh2 = DB::table('vehicles')->insertGetId([
        'vin' => 'CAPVIN2', 'make' => 'M', 'model' => 'M', 'type' => 'T', 'weight' => '1000', 'vehicle_condition' => 'OK', 'origin_country' => 'FR', 'is_primed' => false,
        'created_at' => now(), 'updated_at' => now(),
    ], 'vehicle_id');

    $dis1 = DB::table('discharges')->insertGetId([
        'discharge_timestamp' => now(), 'status' => 'completed', 'port_call_id' => $portCallId, 'vehicle_id' => $veh1, 'agent_id' => $user->user_id, 'created_at' => now(), 'updated_at' => now(),
    ], 'discharge_id');
    $dis2 = DB::table('discharges')->insertGetId([
        'discharge_timestamp' => now(), 'status' => 'completed', 'port_call_id' => $portCallId, 'vehicle_id' => $veh2, 'agent_id' => $user->user_id, 'created_at' => now(), 'updated_at' => now(),
    ], 'discharge_id');

    // First movement OK
    postJson('/api/movements', [
        'note' => 'First into CapTest',
        'timestamp' => now()->toDateTimeString(),
        'from' => 'Quai',
        'to' => 'CapTest',
        'discharge_id' => $dis1,
        'user_id' => $user->user_id,
    ])->assertCreated();

    // Second movement should fail (capacity exceeded)
    postJson('/api/movements', [
        'note' => 'Second into CapTest',
        'timestamp' => now()->toDateTimeString(),
        'from' => 'Quai',
        'to' => 'CapTest',
        'discharge_id' => $dis2,
        'user_id' => $user->user_id,
    ])->assertStatus(400)->assertJsonFragment([
        'error' => 'Parking capacity exceeded for CapTest.',
    ]);
});

it('requires parking_number when destination is Mahasarika', function () {
    $user = User::factory()->create(['role_id' => 1]);
    actingAs($user, 'sanctum');

    $portCallId = seed_port_call();

    // Create Mahasarika parking (capacity arbitrary)
    postJson('/api/parkings', [
        'parking_name' => 'Mahasarika',
        'location' => 'Mahasarika',
        'capacity' => 5,
        'parking_number' => 'MAIN',
    ])->assertCreated();

    $veh = DB::table('vehicles')->insertGetId([
        'vin' => 'MAHAVIN1', 'make' => 'M', 'model' => 'M', 'type' => 'T', 'weight' => '1000', 'vehicle_condition' => 'OK', 'origin_country' => 'FR', 'is_primed' => false,
        'created_at' => now(), 'updated_at' => now(),
    ], 'vehicle_id');
    $dis = DB::table('discharges')->insertGetId([
        'discharge_timestamp' => now(), 'status' => 'completed', 'port_call_id' => $portCallId, 'vehicle_id' => $veh, 'agent_id' => $user->user_id, 'created_at' => now(), 'updated_at' => now(),
    ], 'discharge_id');

    // Missing parking_number => validation 422
    postJson('/api/movements', [
        'note' => 'Into Mahasarika without slot',
        'timestamp' => now()->toDateTimeString(),
        'from' => 'Quai',
        'to' => 'Mahasarika',
        'discharge_id' => $dis,
        'user_id' => $user->user_id,
    ])->assertStatus(422)->assertJsonStructure(['errors' => ['parking_number']]);

    // With parking_number => success
    postJson('/api/movements', [
        'note' => 'Into Mahasarika with slot',
        'timestamp' => now()->toDateTimeString(),
        'from' => 'Quai',
        'to' => 'Mahasarika',
        'parking_number' => 'A01',
        'discharge_id' => $dis,
        'user_id' => $user->user_id,
    ])->assertCreated()->assertJsonFragment(['parking_number' => 'A01']);
});
