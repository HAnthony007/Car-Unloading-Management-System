<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\{User, Vehicle, PortCall, Discharge, Vessel, Dock};

class DischargeShowRelationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_shows_discharge_with_related_entities(): void
    {
        $agent = User::factory()->create();
        $vessel = Vessel::factory()->create();
        $dock = Dock::factory()->create();
        $portCall = PortCall::factory()->create([
            'vessel_id' => $vessel->vessel_id,
            'dock_id' => $dock->dock_id,
        ]);
        $vehicle = Vehicle::factory()->create();
        $this->actingAs($agent, 'sanctum');

        $discharge = Discharge::factory()->create([
            'agent_id' => $agent->user_id,
            'port_call_id' => $portCall->port_call_id,
            'vehicle_id' => $vehicle->vehicle_id,
        ]);

        $resp = $this->getJson('/api/discharges/' . $discharge->discharge_id);
        $resp->assertOk()
            ->assertJsonPath('data.discharge_id', $discharge->discharge_id)
            ->assertJsonPath('data.port_call.port_call_id', $portCall->port_call_id)
            ->assertJsonPath('data.port_call.vessel.vessel_id', $vessel->vessel_id)
            ->assertJsonPath('data.port_call.dock.dock_id', $dock->dock_id)
            ->assertJsonPath('data.vehicle.vehicle_id', $vehicle->vehicle_id)
            ->assertJsonPath('data.agent.user_id', $agent->user_id);
    }
}
