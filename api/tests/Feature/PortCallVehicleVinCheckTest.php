<?php

use App\Models\Discharge;
use App\Models\PortCall;
use App\Models\Role;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);

/**
 * Ensure dependent tables exist (in some tests migrations may be trimmed).
 */
function ensurePortCallVehicleVinCheckTables(): void
{
    // Minimal vessel + dock tables because port_calls references them.
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
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->timestamps();
        });
    }
    if (! Schema::hasTable('vehicles')) {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id('vehicle_id');
            $table->string('vin')->unique();
            $table->string('make');
            $table->string('model');
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('owner_name')->nullable();
            $table->string('color')->nullable();
            $table->string('type');
            $table->string('weight');
            $table->string('vehicle_condition');
            $table->string('vehicle_observation')->nullable();
            $table->string('origin_country');
            $table->string('ship_location')->nullable();
            $table->boolean('is_primed')->default(false);
            $table->timestamps();
        });
    }
    if (! Schema::hasTable('discharges')) {
        Schema::create('discharges', function (Blueprint $table) {
            $table->id('discharge_id');
            $table->dateTime('discharge_timestamp');
            $table->string('status');
            $table->foreignId('port_call_id')->constrained('port_calls', 'port_call_id');
            $table->foreignId('vehicle_id')->constrained('vehicles', 'vehicle_id');
            $table->foreignId('agent_id')->constrained('users', 'user_id');
            $table->timestamps();
        });
    }
}

it('validates VIN format', function () {
    ensurePortCallVehicleVinCheckTables();
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    $portCall = PortCall::factory()->create();

    // Too short
    getJson("/api/port-calls/{$portCall->getKey()}/vehicles/check?vin=123")
        ->assertStatus(422)
        ->assertJsonStructure(['message', 'errors' => ['vin']]);

    // Contains forbidden letter I
    $vin = '1HGCM82633I004352'; // 17 chars but includes I
    getJson("/api/port-calls/{$portCall->getKey()}/vehicles/check?vin={$vin}")
        ->assertStatus(422)
        ->assertJsonStructure(['message', 'errors' => ['vin']]);
});

it('returns vehicle_exists=false when VIN not found', function () {
    ensurePortCallVehicleVinCheckTables();
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    $portCall = PortCall::factory()->create();
    $vin = '1HGCM82633A004352'; // valid pattern

    getJson("/api/port-calls/{$portCall->getKey()}/vehicles/check?vin={$vin}")
        ->assertOk()
        ->assertJson([
            'vin' => $vin,
            'vehicle_exists' => false,
            'vehicle_id' => null,
            'discharge_id' => null,
        ]);
});

it('returns vehicle found but not in port call', function () {
    ensurePortCallVehicleVinCheckTables();
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    $portCall = PortCall::factory()->create();
    $otherPortCall = PortCall::factory()->create();
    $vehicle = Vehicle::factory()->create(['vin' => '1HGCM82633A004352']);

    // Discharge attached to other port call
    Discharge::factory()->create([
        'port_call_id' => $otherPortCall->getKey(),
        'vehicle_id' => $vehicle->getKey(),
        'agent_id' => $user->getKey(),
        'status' => 'pending',
    ]);

    getJson("/api/port-calls/{$portCall->getKey()}/vehicles/check?vin={$vehicle->vin}")
        ->assertOk()
        ->assertJson([
            'vin' => $vehicle->vin,
            'vehicle_exists' => true,
            'vehicle_id' => $vehicle->getKey(),
            'discharge_id' => null,
        ]);
});

it('returns vehicle in port call when discharge exists', function () {
    ensurePortCallVehicleVinCheckTables();
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    $portCall = PortCall::factory()->create();
    $vehicle = Vehicle::factory()->create(['vin' => '1HGCM82633A004352']);

    $discharge = Discharge::factory()->create([
        'port_call_id' => $portCall->getKey(),
        'vehicle_id' => $vehicle->getKey(),
        'agent_id' => $user->getKey(),
        'status' => 'pending',
    ]);

    getJson("/api/port-calls/{$portCall->getKey()}/vehicles/check?vin={$vehicle->vin}")
        ->assertOk()
        ->assertJson([
            'vin' => $vehicle->vin,
            'vehicle_exists' => true,
            'vehicle_id' => $vehicle->getKey(),
            'discharge_id' => $discharge->getKey(),
        ]);
});

it('rejects unauthenticated access', function () {
    ensurePortCallVehicleVinCheckTables();
    $portCall = PortCall::factory()->create();
    getJson("/api/port-calls/{$portCall->getKey()}/vehicles/check?vin=1HGCM82633A004352")
        ->assertUnauthorized();
});
