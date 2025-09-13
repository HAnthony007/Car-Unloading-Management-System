<?php

namespace Tests\Feature;

use App\Models\Discharge;
use App\Models\Dock;
use App\Models\Photo;
use App\Models\PortCall;
use App\Models\Role;
use App\Models\Survey;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Vessel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SurveyCheckpointFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    private function actingUser(): User
    {
        // Ensure a role exists to satisfy FK
        $role = Role::factory()->create(['role_name' => 'Tester']);

        return User::query()->create([
            'matriculation_no' => 'TEST-001',
            'full_name' => 'Tester',
            'email' => 'tester@example.com',
            'password' => Hash::make('secret'),
            'role_id' => $role->role_id,
        ]);
    }

    private function makeSupportGraph(User $agent): array
    {
        $vessel = new Vessel;
        $vessel->imo_no = 'IMO'.random_int(10000, 99999);
        $vessel->vessel_name = 'Test Vessel';
        $vessel->flag = 'FR';
        $vessel->save();

        $dock = new Dock;
        $dock->dock_name = 'Dock A';
        $dock->location = 'Zone 1';
        $dock->save();

        $pc = new PortCall;
        $pc->vessel_agent = 'Agent X';
        $pc->origin_port = 'Origin';
        $pc->estimated_arrival = now();
        $pc->arrival_date = now();
        $pc->vessel_id = $vessel->vessel_id;
        $pc->dock_id = $dock->dock_id;
        $pc->save();

        $vehicle = new Vehicle;
        $vehicle->vin = 'VIN'.random_int(10000, 99999);
        $vehicle->make = 'Make';
        $vehicle->model = 'Model';
        $vehicle->type = 'Type';
        $vehicle->weight = '1000kg';
        $vehicle->vehicle_condition = 'Neuf';
        $vehicle->origin_country = 'FR';
        $vehicle->save();
        $discharge = new Discharge;
        $discharge->discharge_timestamp = now();
        $discharge->status = 'pending';
        $discharge->port_call_id = $pc->port_call_id;
        $discharge->vehicle_id = $vehicle->vehicle_id;
        $discharge->agent_id = $agent->user_id;
        $discharge->save();

        return [$discharge, $vehicle, $pc];
    }

    public function test_crud_flow(): void
    {
        $this->withoutExceptionHandling();
        $user = $this->actingUser();
        $this->actingAs($user, 'sanctum');
        [$discharge, $vehicle] = $this->makeSupportGraph($user);

        $survey = Survey::query()->create([
            'survey_date' => now(),
            'overall_status' => 'PENDING',
            'agent_id' => $user->user_id,
            'discharge_id' => $discharge->discharge_id,
        ]);

        $create = $this->postJson('/api/survey-checkpoints', [
            'title_checkpoint' => 'Entry Gate',
            'comment_checkpoint' => 'All good',
            'survey_id' => $survey->survey_id,
        ]);
        $create->assertCreated();
        $id = $create->json('data.checkpoint_id');

        $index = $this->getJson('/api/survey-checkpoints?survey_id='.$survey->survey_id.'&per_page=1&page=1');
        $index->assertOk();
        $this->assertGreaterThan(0, $index->json('meta.total'));

        $show = $this->getJson('/api/survey-checkpoints/'.$id);
        $show->assertOk();
        $this->assertSame('Entry Gate', $show->json('data.title_checkpoint'));

        $update = $this->putJson('/api/survey-checkpoints/'.$id, ['title_checkpoint' => 'Exit Gate']);
        $update->assertOk();
        $this->assertSame('Exit Gate', $update->json('data.title_checkpoint'));

        Photo::query()->create([
            'photo_path' => 'path.jpg',
            'taken_at' => now(),
            'photo_description' => 'desc',
            'discharge_id' => $discharge->discharge_id,
            'checkpoint_id' => $id,
        ]);

        $withPhotos = $this->getJson('/api/survey-checkpoints?survey_id='.$survey->survey_id.'&with_photos=1');
        $withPhotos->assertOk();
        $this->assertIsArray($withPhotos->json('data.0.photos'));

        $del = $this->deleteJson('/api/survey-checkpoints/'.$id);
        $del->assertOk();
    }
}
