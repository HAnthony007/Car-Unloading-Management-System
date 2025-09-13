<?php

namespace Tests\Feature;

use App\Models\Discharge;
use App\Models\PortCall;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DischargeApiTest extends TestCase
{
    use RefreshDatabase;

    private function authHeaders(User $user): array
    {
        // Assuming Sanctum; create token
        $token = $user->createToken('test')->plainTextToken;

        return [
            'Authorization' => 'Bearer '.$token,
            'Accept' => 'application/json',
        ];
    }

    public function test_can_create_discharge_with_vehicle_and_agent(): void
    {
        $user = User::factory()->create();
        $agent = User::factory()->create();
        $vehicle = Vehicle::factory()->create();
        $portCall = PortCall::factory()->create();

        $payload = [
            'discharge_date' => now()->toISOString(),
            'port_call_id' => $portCall->port_call_id,
            'vehicle_id' => $vehicle->vehicle_id,
            'agent_id' => $agent->user_id,
        ];

        $res = $this->postJson('/api/discharges', $payload, $this->authHeaders($user));

        $res->assertCreated()
            ->assertJsonPath('data.port_call_id', $portCall->port_call_id)
            ->assertJsonPath('data.vehicle_id', $vehicle->vehicle_id)
            ->assertJsonPath('data.agent_id', $agent->user_id);

        $this->assertDatabaseHas('discharges', [
            'port_call_id' => $portCall->port_call_id,
            'vehicle_id' => $vehicle->vehicle_id,
            'agent_id' => $agent->user_id,
        ]);
    }

    public function test_validation_errors_when_missing_required_fields(): void
    {
        $user = User::factory()->create();
        $res = $this->postJson('/api/discharges', [], $this->authHeaders($user));
        $res->assertStatus(422)->assertJsonValidationErrors(['discharge_date', 'port_call_id', 'vehicle_id', 'agent_id']);
    }

    public function test_can_update_vehicle_and_agent(): void
    {
        $user = User::factory()->create();
        $initialAgent = User::factory()->create();
        $newAgent = User::factory()->create();
        $initialVehicle = Vehicle::factory()->create();
        $newVehicle = Vehicle::factory()->create();
        $discharge = Discharge::factory()->create([
            'agent_id' => $initialAgent->user_id,
            'vehicle_id' => $initialVehicle->vehicle_id,
        ]);

        $payload = [
            'vehicle_id' => $newVehicle->vehicle_id,
            'agent_id' => $newAgent->user_id,
        ];

        $res = $this->putJson('/api/discharges/'.$discharge->discharge_id, $payload, $this->authHeaders($user));
        $res->assertOk()
            ->assertJsonPath('data.vehicle_id', $newVehicle->vehicle_id)
            ->assertJsonPath('data.agent_id', $newAgent->user_id);

        $this->assertDatabaseHas('discharges', [
            'discharge_id' => $discharge->discharge_id,
            'vehicle_id' => $newVehicle->vehicle_id,
            'agent_id' => $newAgent->user_id,
        ]);
    }

    public function test_list_includes_vehicle_and_agent_without_extra_queries(): void
    {
        $user = User::factory()->create();
        Discharge::factory()->count(3)->create();

        DB::enableQueryLog();
        $res = $this->getJson('/api/discharges', $this->authHeaders($user));
        $res->assertOk();
        $data = $res->json('data');
        $this->assertNotEmpty($data);
        $first = $data[0];
        $this->assertArrayHasKey('vehicle_id', $first);
        $this->assertArrayHasKey('agent_id', $first);
        // Optional heuristic: ensure queries not exploding (<= 10 for listing 3 discharges with eager load)
        $queries = DB::getQueryLog();
        $this->assertLessThanOrEqual(10, count($queries), 'Too many queries, eager loading might be missing.');
        DB::disableQueryLog();
    }
}
