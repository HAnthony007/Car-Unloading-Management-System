<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

describe('Parking discharges endpoint', function () {
    beforeEach(function () {
        Role::factory()->create(['role_id' => 1]);
    });

    it('rejects unauthenticated access', function () {
        getJson('/api/parkings/1/discharges')->assertUnauthorized();
    });

    it('returns discharges list for a parking with movements', function () {
        $user = User::factory()->create(['role_id' => 1]);
        actingAs($user, 'sanctum');

        // Seed minimal required related models (vessel, dock, port_call, vehicle, parking)
        $vesselId = DB::table('vessels')->insertGetId([
            'imo_no' => '1234567',
            'vessel_name' => 'Test Vessel',
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
        $portCallId = DB::table('port_calls')->insertGetId([
            'vessel_agent' => 'Agent A',
            'origin_port' => 'Origin',
            'estimated_arrival' => now(),
            'arrival_date' => now(),
            'estimated_departure' => null,
            'departure_date' => null,
            'vessel_id' => $vesselId,
            'dock_id' => $dockId,
            'created_at' => now(),
            'updated_at' => now(),
        ], 'port_call_id');

        // Create parking via API to ensure resource exists
        $parkingResp = postJson('/api/parkings', [
            'parking_name' => 'Mahasarika',
            'location' => 'Mahasarika',
            'capacity' => 10,
            'parking_number' => 'MAIN-01',
        ]);
        $parkingResp->assertCreated();
        $parkingId = $parkingResp->json('data.parking_id');

        // Vehicles and discharges
        $vehicleId = DB::table('vehicles')->insertGetId([
            'vin' => 'VINPARK1', 'make' => 'Make', 'model' => 'Model', 'type' => 'Type', 'weight' => '1000',
            'vehicle_condition' => 'OK', 'origin_country' => 'FR', 'is_primed' => false,
            'created_at' => now(), 'updated_at' => now(),
        ], 'vehicle_id');
        $dischargeId = DB::table('discharges')->insertGetId([
            'discharge_timestamp' => now(),
            'status' => 'completed',
            'port_call_id' => $portCallId,
            'vehicle_id' => $vehicleId,
            'agent_id' => $user->user_id,
            'created_at' => now(),
            'updated_at' => now(),
        ], 'discharge_id');

        // Create a movement referencing the discharge and moving to this parking
        $movementResp = postJson('/api/movements', [
            'note' => 'Initial placement',
            'timestamp' => now()->toDateTimeString(),
            'from' => 'Quai',
            'to' => 'Mahasarika',
            'parking_number' => 'A01',
            'discharge_id' => $dischargeId,
            'user_id' => $user->user_id,
        ]);
        $movementResp->assertCreated();

        // Call endpoint
        $resp = getJson("/api/parkings/{$parkingId}/discharges");
        $resp->assertOk()
            ->assertJsonStructure([
                'parking_id', 'parking_name', 'total', 'discharges' => [
                    ['discharge_id', 'discharge_date', 'port_call_id', 'parking_number'],
                ],
            ])
            ->assertJsonFragment(['total' => 1])
            ->assertJsonFragment(['discharge_id' => $dischargeId]);
    });
});
