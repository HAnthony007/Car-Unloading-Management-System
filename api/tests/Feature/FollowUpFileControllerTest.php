<?php

use App\Models\PortCall;
use App\Models\Role;
use App\Models\User as EloquentUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);

function seedPortCall(): PortCall
{
    $dockId = DB::table('docks')->insertGetId([
        'dock_name' => 'Dock A',
        'location' => 'Zone 1',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $vesselId = DB::table('vessels')->insertGetId([
        'imo_no' => 'IMO1234567',
        'vessel_name' => 'Vessel X',
        'flag' => 'BJ',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $portCallId = DB::table('port_calls')->insertGetId([
        'vessel_agent' => 'Agent Z',
        'origin_port' => 'Origin',
        'estimated_arrival' => now(),
        'arrival_date' => now(),
        'estimated_departure' => now()->addDays(2),
        'departure_date' => now()->addDays(3),
        'vessel_id' => $vesselId,
        'dock_id' => $dockId,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return PortCall::find($portCallId);
}

beforeEach(function () {
    $GLOBALS['__role'] = Role::factory()->create([
        'role_name' => 'User',
        'role_description' => 'Regular user',
    ]);
    $GLOBALS['__user'] = EloquentUser::factory()->create([
        'role_id' => $GLOBALS['__role']->role_id,
        'email_verified_at' => now(),
    ]);
    Sanctum::actingAs($GLOBALS['__user']);
});

describe('Follow Up File API Endpoints', function () {
    it('lists follow up files with pagination and filters', function () {
        $portCall = seedPortCall();
        $vehicleId = DB::table('vehicles')->insertGetId([
            'vin' => 'VIN001',
            'make' => 'Toyota',
            'model' => 'Corolla',
            'color' => 'Blue',
            'type' => 'Sedan',
            'weight' => '1200',
            'vehicle_condition' => 'NEW',
            'vehicle_observation' => null,
            'origin_country' => 'JP',
            'ship_location' => null,
            'is_primed' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('follow_up_files')->insert([
            'bill_of_lading' => 'BOL-ABC-001',
            'status' => 'OPEN',
            'vehicle_id' => $vehicleId,
            'port_call_id' => $portCall->port_call_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = getJson('/api/follow-up-files?bill_of_lading=BOL-ABC');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [[
                    'follow_up_file_id', 'bill_of_lading', 'status', 'vehicle_id', 'port_call_id',
                ]],
                'meta' => ['current_page', 'from', 'last_page', 'path', 'per_page', 'to', 'total'],
            ])
            ->assertJsonPath('data.0.bill_of_lading', 'BOL-ABC-001');
    });

    it('creates a follow up file', function () {
        $portCall = seedPortCall();
        $vehicleId = DB::table('vehicles')->insertGetId([
            'vin' => 'VIN002', 'make' => 'Honda', 'model' => 'Civic', 'color' => 'Red', 'type' => 'Sedan',
            'weight' => '1250', 'vehicle_condition' => 'USED', 'vehicle_observation' => null, 'origin_country' => 'JP',
            'ship_location' => null, 'is_primed' => 0,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $payload = [
            'bill_of_lading' => 'BOL-XYZ-001',
            'status' => 'IN_PROGRESS',
            'vehicle_id' => $vehicleId,
            'port_call_id' => $portCall->port_call_id,
        ];

        $response = postJson('/api/follow-up-files', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.bill_of_lading', 'BOL-XYZ-001')
            ->assertJsonPath('data.status', 'IN_PROGRESS');

        assertDatabaseHas('follow_up_files', [
            'bill_of_lading' => 'BOL-XYZ-001',
            'status' => 'IN_PROGRESS',
            'vehicle_id' => $vehicleId,
            'port_call_id' => $portCall->port_call_id,
        ]);
    });

    it('validates request when creating', function () {
        $response = postJson('/api/follow-up-files', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['bill_of_lading', 'status', 'vehicle_id', 'port_call_id']);
    });

    it('shows a follow up file', function () {
        $portCall = seedPortCall();
        $vehicleId = DB::table('vehicles')->insertGetId([
            'vin' => 'VIN003', 'make' => 'Ford', 'model' => 'Focus', 'color' => 'Blue', 'type' => 'Hatch',
            'weight' => '1300', 'vehicle_condition' => 'NEW', 'vehicle_observation' => null, 'origin_country' => 'US',
            'ship_location' => null, 'is_primed' => 0,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $fufId = DB::table('follow_up_files')->insertGetId([
            'bill_of_lading' => 'BOL-FOO-123',
            'status' => 'OPEN',
            'vehicle_id' => $vehicleId,
            'port_call_id' => $portCall->port_call_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = getJson('/api/follow-up-files/'.$fufId);
        $response->assertStatus(200)
            ->assertJsonPath('data.follow_up_file_id', (string) $fufId)
            ->assertJsonPath('data.bill_of_lading', 'BOL-FOO-123');
    });

    it('updates a follow up file', function () {
        $portCall = seedPortCall();
        $vehicleId = DB::table('vehicles')->insertGetId([
            'vin' => 'VIN004', 'make' => 'Nissan', 'model' => 'Leaf', 'color' => 'Green', 'type' => 'Hatch',
            'weight' => '1400', 'vehicle_condition' => 'USED', 'vehicle_observation' => null, 'origin_country' => 'JP',
            'ship_location' => null, 'is_primed' => 0,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $fufId = DB::table('follow_up_files')->insertGetId([
            'bill_of_lading' => 'BOL-BAR-456',
            'status' => 'OPEN',
            'vehicle_id' => $vehicleId,
            'port_call_id' => $portCall->port_call_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = putJson('/api/follow-up-files/'.$fufId, [
            'status' => 'CLOSED',
        ]);
        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'CLOSED');

        assertDatabaseHas('follow_up_files', [
            'follow_up_file_id' => $fufId,
            'status' => 'CLOSED',
        ]);
    });

    it('deletes a follow up file', function () {
        $portCall = seedPortCall();
        $vehicleId = DB::table('vehicles')->insertGetId([
            'vin' => 'VIN005', 'make' => 'BMW', 'model' => 'X5', 'color' => 'Black', 'type' => 'SUV',
            'weight' => '2200', 'vehicle_condition' => 'NEW', 'vehicle_observation' => null, 'origin_country' => 'DE',
            'ship_location' => null, 'is_primed' => 0,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $fufId = DB::table('follow_up_files')->insertGetId([
            'bill_of_lading' => 'BOL-DEL-789',
            'status' => 'OPEN',
            'vehicle_id' => $vehicleId,
            'port_call_id' => $portCall->port_call_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = deleteJson('/api/follow-up-files/'.$fufId);
        $response->assertStatus(200)
            ->assertJson(['message' => 'FollowUpFile deleted successfully.']);

        assertDatabaseMissing('follow_up_files', [
            'follow_up_file_id' => $fufId,
        ]);
    });

    it('requires authentication on endpoints', function () {
        app('auth')->forgetGuards();

        getJson('/api/follow-up-files')->assertStatus(401);
        postJson('/api/follow-up-files', [])->assertStatus(401);
        getJson('/api/follow-up-files/1')->assertStatus(401);
        putJson('/api/follow-up-files/1', [])->assertStatus(401);
        deleteJson('/api/follow-up-files/1')->assertStatus(401);
    });
});
