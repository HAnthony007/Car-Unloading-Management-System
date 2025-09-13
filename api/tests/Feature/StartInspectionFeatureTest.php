<?php

namespace Tests\Feature;

use App\Models\Discharge;
use App\Models\Dock;
use App\Models\PortCall;
use App\Models\Role;
use App\Models\User as EloquentUser;
use App\Models\Vehicle;
use App\Models\Vessel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StartInspectionFeatureTest extends TestCase
{
    use RefreshDatabase;

    private EloquentUser $user;

    private Discharge $discharge;

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

    public function test_starts_inspection_creates_surveys_and_checkpoints(): void
    {
        // Ensure templates are seeded
        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\SurveyTemplateSeeder']);

        $this->postJson('/api/inspections/start', [
            'discharge_id' => $this->discharge->discharge_id,
        ])->assertCreated()
            ->assertJsonPath('message', 'Inspection initialisée.')
            ->assertJsonStructure(['data' => [['survey_id', 'survey_name', 'checkpoints' => [['checkpoint_id', 'title_checkpoint', 'order_checkpoint']]]]]);

        $templatesCount = \App\Models\SurveyTemplate::count();
        $templateCheckpointTotal = \App\Models\SurveyTemplateCheckpoint::count();
        $this->assertDatabaseCount('surveys', $templatesCount);
        $this->assertDatabaseHas('surveys', ['discharge_id' => $this->discharge->discharge_id]);
        $this->assertDatabaseCount('survey_checkpoints', $templateCheckpointTotal);
    }

    public function test_second_call_is_idempotent(): void
    {
        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\SurveyTemplateSeeder']);
        $this->postJson('/api/inspections/start', ['discharge_id' => $this->discharge->discharge_id])->assertCreated();
        $this->postJson('/api/inspections/start', ['discharge_id' => $this->discharge->discharge_id])->assertOk()
            ->assertJsonPath('message', 'Inspection déjà initialisée pour ce discharge.');
    }

    public function test_force_flag_allows_reinitialization(): void
    {
        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\SurveyTemplateSeeder']);
        $this->postJson('/api/inspections/start', ['discharge_id' => $this->discharge->discharge_id])->assertCreated();
        $this->postJson('/api/inspections/start', ['discharge_id' => $this->discharge->discharge_id, 'force' => true])->assertCreated();
        $templatesCount = \App\Models\SurveyTemplate::count();
        $this->assertDatabaseCount('surveys', $templatesCount * 2); // force adds another set
    }

    public function test_validation_errors(): void
    {
        $this->postJson('/api/inspections/start', [])->assertStatus(422)
            ->assertJsonValidationErrors(['discharge_id']);
    }

    public function test_requires_authentication(): void
    {
        app('auth')->forgetGuards();
        $this->postJson('/api/inspections/start', ['discharge_id' => $this->discharge->discharge_id])->assertStatus(401);
    }
}
