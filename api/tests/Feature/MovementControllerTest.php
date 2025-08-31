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

function ensure_movement_schema(): void
{
    if (! Schema::hasTable('discharges')) {
        Schema::create('discharges', function (Blueprint $table) {
            $table->id('discharge_id');
            $table->timestamp('discharge_date')->nullable();
            $table->unsignedBigInteger('port_call_id')->nullable();
            $table->timestamps();
        });
    }
    if (! Schema::hasTable('users')) {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('matriculation_no')->unique();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->string('phone')->nullable();
            $table->unsignedBigInteger('role_id');
            $table->rememberToken();
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
            $table->unsignedBigInteger('discharge_id')->nullable();
            $table->timestamps();
        });
    }

    if (! Schema::hasTable('movements')) {
        Schema::create('movements', function (Blueprint $table) {
            $table->id('movement_id');
            $table->string('note')->nullable();
            $table->dateTime('timestamp');
            $table->string('from')->nullable();
            $table->string('to')->nullable();
            $table->string('parking_number', 50)->nullable();
            $table->unsignedBigInteger('vehicle_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
        });
    }
}

it('creates, shows, updates, deletes and lists movements (auth required)', function () {
    ensure_movement_schema();

    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    actingAs($user, 'sanctum');

    // Seed minimal dependencies for discharge -> port_call -> vessel/dock
    $vesselId = DB::table('vessels')->insertGetId([
        'imo_no' => '3333333',
        'vessel_name' => 'Beta',
        'flag' => 'FR',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'vessel_id');
    $dockId = DB::table('docks')->insertGetId([
        'dock_name' => 'Dock Z',
        'location' => 'Zone Z',
        'created_at' => now(),
        'updated_at' => now(),
    ], 'dock_id');
    $portCallId = DB::table('port_calls')->insertGetId([
        'vessel_agent' => 'Agent Z',
        'origin_port' => 'Origin Z',
        'estimated_arrival' => null,
        'arrival_date' => now(),
        'estimated_departure' => null,
        'departure_date' => null,
        'vessel_id' => $vesselId,
        'dock_id' => $dockId,
        'created_at' => now(),
        'updated_at' => now(),
    ], 'port_call_id');

    // Seed a vehicle
    // Seed discharge to satisfy NOT NULL FK from vehicles migration when using RefreshDatabase
    $dischargeId = DB::table('discharges')->insertGetId([
        'discharge_date' => now(),
        'port_call_id' => $portCallId,
        'created_at' => now(),
        'updated_at' => now(),
    ], 'discharge_id');

    $vehicleId = DB::table('vehicles')->insertGetId([
        'vin' => 'MOVVIN1', 'make' => 'Make', 'model' => 'Model', 'type' => 'Type', 'weight' => '1000',
        'vehicle_condition' => 'OK', 'origin_country' => 'FR', 'is_primed' => false,
        'discharge_id' => $dischargeId,
        'created_at' => now(), 'updated_at' => now(),
    ], 'vehicle_id');

    // Create movement
    $payload = [
        'note' => 'Move to Yard B',
        'timestamp' => now()->toDateTimeString(),
        'from' => 'Yard A',
        'to' => 'Yard B',
        'vehicle_id' => $vehicleId,
        'user_id' => $user->user_id,
    ];
    $resp = postJson('/api/movements', $payload);
    if ($resp->status() !== 201) {
        $resp->dump();
    }
    $resp->assertCreated()->assertJsonStructure(['message', 'data' => ['movement_id', 'timestamp', 'vehicle_id', 'user_id']]);
    $movementId = $resp->json('data.movement_id');

    // Show
    getJson("/api/movements/{$movementId}")->assertSuccessful()->assertJsonFragment(['to' => 'Yard B']);

    // Update
    putJson("/api/movements/{$movementId}", ['note' => 'Moved', 'to' => 'Zone C'])
        ->assertSuccessful()->assertJsonFragment(['note' => 'Moved', 'to' => 'Zone C']);

    // Index (search)
    getJson('/api/movements?page=1&per_page=5')->assertSuccessful()->assertJsonStructure(['data', 'meta' => ['current_page', 'per_page', 'total']]);

    // Nested by vehicle
    getJson("/api/vehicles/{$vehicleId}/movements")
        ->assertSuccessful()
        ->assertJsonStructure(['data', 'meta' => ['current_page', 'per_page', 'total']]);

    // Delete
    deleteJson("/api/movements/{$movementId}")->assertSuccessful()->assertJsonFragment(['message' => 'Movement deleted successfully.']);
});

it('rejects unauthenticated access to movements', function () {
    ensure_movement_schema();
    postJson('/api/movements', [])->assertUnauthorized();
    getJson('/api/movements')->assertUnauthorized();
});
