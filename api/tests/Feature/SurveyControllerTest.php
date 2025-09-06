<?php

namespace Tests\Feature;

use App\Models\Discharge;
use App\Models\Dock;
use App\Models\PortCall;
use App\Models\Role;
use App\Models\Survey as EloquentSurvey;
use App\Models\User as EloquentUser;
use App\Models\Vehicle;
use App\Models\Vessel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SurveyControllerTest extends TestCase
{
    use RefreshDatabase;

    protected EloquentUser $user;

    protected Discharge $discharge;

    protected function setUp(): void
    {
        parent::setUp();
        $role = Role::factory()->create();
        $this->user = EloquentUser::factory()->create(['role_id' => $role->role_id, 'email_verified_at' => now()]);
        Sanctum::actingAs($this->user);
        $this->discharge = $this->buildGraph();
    }

    private function buildGraph(): Discharge
    {
        $vessel = Vessel::create([
            'imo_no' => 'IMO'.random_int(10000, 99999),
            'vessel_name' => 'Test Vessel',
            'flag' => 'FR',
        ]);
        $dock = Dock::create([
            'dock_name' => 'Dock A',
            'location' => 'Zone 1',
        ]);
        $pc = PortCall::create([
            'vessel_agent' => 'Agent X',
            'origin_port' => 'Origin',
            'estimated_arrival' => now(),
            'arrival_date' => now(),
            'vessel_id' => $vessel->vessel_id,
            'dock_id' => $dock->dock_id,
        ]);
        $vehicle = Vehicle::create([
            'vin' => 'VIN'.random_int(10000, 99999),
            'make' => 'Make',
            'model' => 'Model',
            'type' => 'Type',
            'weight' => '1000',
            'vehicle_condition' => 'Neuf',
            'origin_country' => 'FR',
            'is_primed' => false,
        ]);

        return Discharge::create([
            'discharge_timestamp' => now(),
            'status' => 'pending',
            'port_call_id' => $pc->port_call_id,
            'vehicle_id' => $vehicle->vehicle_id,
            'agent_id' => $this->user->user_id,
        ]);
    }

    public function test_lists_surveys(): void
    {
        // Because discharge_id is unique per survey we must create a new discharge for each survey
        for ($i = 0; $i < 3; $i++) {
            $discharge = $this->buildGraph();
            EloquentSurvey::create([
                'survey_date' => now(),
                'overall_status' => 'PENDING',
                'agent_id' => $this->user->user_id,
                'discharge_id' => $discharge->discharge_id,
            ]);
        }
        $this->getJson('/api/surveys')
            ->assertOk()
            ->assertJsonStructure(['data' => [['survey_id', 'survey_date', 'overall_status', 'agent_id', 'discharge_id']], 'meta']);
    }

    public function test_filters_by_overall_status(): void
    {
        // Clear any existing surveys from previous tests (since we are not isolating via DB refresh between tests)
        \App\Models\Survey::query()->delete();
        // Need two different discharges because discharge_id is unique per survey
        $discharge2 = $this->buildGraph();
        EloquentSurvey::create([
            'survey_date' => now(), 'overall_status' => 'PASSED', 'agent_id' => $this->user->user_id, 'discharge_id' => $this->discharge->discharge_id,
        ]);
        EloquentSurvey::create([
            'survey_date' => now(), 'overall_status' => 'PENDING', 'agent_id' => $this->user->user_id, 'discharge_id' => $discharge2->discharge_id,
        ]);
        $this->getJson('/api/surveys?overall_status=PENDING')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_creates_survey(): void
    {
        $payload = [
            'survey_date' => now()->toDateTimeString(),
            'overall_status' => 'PENDING',
            'agent_id' => $this->user->user_id,
            'discharge_id' => $this->discharge->discharge_id,
        ];
        $this->postJson('/api/surveys', $payload)
            ->assertCreated()
            ->assertJsonPath('data.overall_status', 'PENDING');
        $this->assertDatabaseHas('surveys', [
            'overall_status' => 'PENDING',
            'discharge_id' => $this->discharge->discharge_id,
        ]);
    }

    public function test_validates_create(): void
    {
        $this->postJson('/api/surveys', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['survey_date', 'overall_status', 'agent_id', 'discharge_id']);
    }

    public function test_shows_survey(): void
    {
        $discharge2 = $this->buildGraph();
        $survey = EloquentSurvey::create([
            'survey_date' => now(), 'overall_status' => 'PASSED', 'agent_id' => $this->user->user_id, 'discharge_id' => $discharge2->discharge_id,
        ]);
        $this->getJson('/api/surveys/'.$survey->survey_id)
            ->assertOk()
            ->assertJsonPath('data.survey_id', $survey->survey_id);
    }

    public function test_show_404(): void
    {
        $this->getJson('/api/surveys/999999')->assertStatus(404);
    }

    public function test_updates_survey(): void
    {
        $discharge2 = $this->buildGraph();
        $survey = EloquentSurvey::create([
            'survey_date' => now(), 'overall_status' => 'PENDING', 'agent_id' => $this->user->user_id, 'discharge_id' => $discharge2->discharge_id,
        ]);
        $this->putJson('/api/surveys/'.$survey->survey_id, ['overall_status' => 'PASSED'])
            ->assertOk()
            ->assertJsonPath('data.overall_status', 'PASSED');
        $this->assertDatabaseHas('surveys', [
            'survey_id' => $survey->survey_id,
            'overall_status' => 'PASSED',
        ]);
    }

    public function test_update_validation_enum(): void
    {
        $discharge2 = $this->buildGraph();
        $survey = EloquentSurvey::create([
            'survey_date' => now(), 'overall_status' => 'PENDING', 'agent_id' => $this->user->user_id, 'discharge_id' => $discharge2->discharge_id,
        ]);
        $this->putJson('/api/surveys/'.$survey->survey_id, ['overall_status' => 'NOPE'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['overall_status']);
    }

    public function test_update_404(): void
    {
        $this->putJson('/api/surveys/999999', ['overall_status' => 'PASSED'])
            ->assertStatus(404);
    }

    public function test_deletes_survey(): void
    {
        $survey = EloquentSurvey::create([
            'survey_date' => now(), 'overall_status' => 'PENDING', 'agent_id' => $this->user->user_id, 'discharge_id' => $this->discharge->discharge_id,
        ]);
        $this->deleteJson('/api/surveys/'.$survey->survey_id)
            ->assertOk()
            ->assertJson(['message' => 'Survey deleted successfully.']);
        $this->assertDatabaseMissing('surveys', ['survey_id' => $survey->survey_id]);
    }

    public function test_delete_404(): void
    {
        $this->deleteJson('/api/surveys/999999')->assertStatus(404);
    }

    public function test_requires_auth(): void
    {
        app('auth')->forgetGuards();
        $this->getJson('/api/surveys')->assertStatus(401);
        $this->postJson('/api/surveys', [])->assertStatus(401);
        $this->getJson('/api/surveys/1')->assertStatus(401);
        $this->putJson('/api/surveys/1', [])->assertStatus(401);
        $this->deleteJson('/api/surveys/1')->assertStatus(401);
    }
}
