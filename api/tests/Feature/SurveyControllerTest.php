<?php

use App\Models\Dock;
use App\Models\Discharge;
use App\Models\FollowUpFile;
use App\Models\PortCall;
use App\Models\Role;
use App\Models\Survey as EloquentSurvey;
use App\Models\User as EloquentUser;
use App\Models\Vehicle;
use App\Models\Vessel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

/**
 * Build minimal graph: Vessel->Dock->PortCall, Discharge->Vehicle, FollowUpFile.
 * Returns array [FollowUpFile, User].
 */
function make_support_graph(): array
{
    $vessel = new Vessel();
    $vessel->imo_no = 'IMO'.random_int(10000, 99999);
    $vessel->vessel_name = 'Test Vessel';
    $vessel->flag = 'FR';
    $vessel->save();

    $dock = new Dock();
    $dock->dock_name = 'Dock A';
    $dock->location = 'Zone 1';
    $dock->save();

    $pc = new PortCall();
    $pc->vessel_agent = 'Agent X';
    $pc->origin_port = 'Origin';
    $pc->arrival_date = now();
    $pc->vessel_id = $vessel->vessel_id;
    $pc->dock_id = $dock->dock_id;
    $pc->save();

    $discharge = new Discharge();
    $discharge->discharge_date = now();
    $discharge->port_call_id = $pc->port_call_id;
    $discharge->save();

    $vehicle = new Vehicle();
    $vehicle->vin = 'VIN'.random_int(10000, 99999);
    $vehicle->make = 'Make';
    $vehicle->model = 'Model';
    $vehicle->type = 'Type';
    $vehicle->weight = '1000kg';
    $vehicle->vehicle_condition = 'Neuf';
    $vehicle->origin_country = 'FR';
    $vehicle->discharge_id = $discharge->discharge_id;
    $vehicle->save();

    $fuf = new FollowUpFile();
    $fuf->bill_of_lading = 'BOL'.random_int(1000, 9999);
    $fuf->status = 'OPEN';
    $fuf->vehicle_id = $vehicle->vehicle_id;
    $fuf->port_call_id = $pc->port_call_id;
    $fuf->save();

    return [$fuf];
}

beforeEach(function () {
    // Role and authenticated user
    $this->role = Role::factory()->create([
        'role_name' => 'User',
        'role_description' => 'Regular user',
    ]);

    $this->user = EloquentUser::factory()->create([
        'role_id' => $this->role->role_id,
        'email_verified_at' => now(),
    ]);

    Sanctum::actingAs($this->user);

    [$this->fuf] = make_support_graph();
});

describe('Survey API Endpoints', function () {
    describe('GET /api/surveys - List Surveys', function () {
        it('returns paginated surveys list', function () {
            // create some surveys
            for ($i = 0; $i < 5; $i++) {
                EloquentSurvey::create([
                    'date' => now()->toDateString(),
                    'result' => 'PENDING',
                    'user_id' => $this->user->user_id,
                    'follow_up_file_id' => $this->fuf->follow_up_file_id,
                ]);
            }

            $response = $this->getJson('/api/surveys');

            $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => ['survey_id', 'date', 'result', 'user_id', 'follow_up_file_id'],
                    ],
                    'meta' => [
                        'current_page', 'from', 'last_page', 'path', 'per_page', 'to', 'total',
                    ],
                ]);
        });

        it('filters by result', function () {
            EloquentSurvey::create([
                'date' => now()->toDateString(),
                'result' => 'PASSED',
                'user_id' => $this->user->user_id,
                'follow_up_file_id' => $this->fuf->follow_up_file_id,
            ]);
            EloquentSurvey::create([
                'date' => now()->toDateString(),
                'result' => 'PENDING',
                'user_id' => $this->user->user_id,
                'follow_up_file_id' => $this->fuf->follow_up_file_id,
            ]);

            $response = $this->getJson('/api/surveys?result=PENDING');
            $response->assertStatus(200)->assertJsonCount(1, 'data');
        });
    });

    describe('POST /api/surveys - Create Survey', function () {
        it('creates a new survey successfully', function () {
            $payload = [
                'date' => now()->toDateString(),
                'result' => 'PENDING',
                'user_id' => $this->user->user_id,
                'follow_up_file_id' => $this->fuf->follow_up_file_id,
            ];

            $response = $this->postJson('/api/surveys', $payload);

            $response->assertStatus(201)
                ->assertJson([
                    'message' => 'Survey created successfully.',
                ])
                ->assertJsonStructure([
                    'data' => ['survey_id', 'date', 'result', 'user_id', 'follow_up_file_id'],
                ]);

            $this->assertDatabaseHas('surveys', [
                'result' => 'PENDING',
                'user_id' => $this->user->user_id,
                'follow_up_file_id' => $this->fuf->follow_up_file_id,
            ]);
        });

        it('validates required fields', function () {
            $response = $this->postJson('/api/surveys', []);
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['date', 'result', 'user_id', 'follow_up_file_id']);
        });

        it('validates enum for result', function () {
            $payload = [
                'date' => now()->toDateString(),
                'result' => 'WRONG',
                'user_id' => $this->user->user_id,
                'follow_up_file_id' => $this->fuf->follow_up_file_id,
            ];
            $this->postJson('/api/surveys', $payload)
                ->assertStatus(422)
                ->assertJsonValidationErrors(['result']);
        });
    });

    describe('GET /api/surveys/{id} - Show Survey', function () {
        it('returns survey details by ID', function () {
            $survey = EloquentSurvey::create([
                'date' => now()->toDateString(),
                'result' => 'PASSED',
                'user_id' => $this->user->user_id,
                'follow_up_file_id' => $this->fuf->follow_up_file_id,
            ]);

            $this->getJson('/api/surveys/'.$survey->survey_id)
                ->assertStatus(200)
                ->assertJsonPath('data.survey_id', $survey->survey_id);
        });

        it('returns 404 for non-existent survey', function () {
            $this->getJson('/api/surveys/999999')->assertStatus(404);
        });
    });

    describe('PUT /api/surveys/{id} - Update Survey', function () {
        it('updates survey successfully', function () {
            $survey = EloquentSurvey::create([
                'date' => now()->toDateString(),
                'result' => 'PENDING',
                'user_id' => $this->user->user_id,
                'follow_up_file_id' => $this->fuf->follow_up_file_id,
            ]);

            $payload = ['result' => 'PASSED'];
            $this->putJson('/api/surveys/'.$survey->survey_id, $payload)
                ->assertStatus(200)
                ->assertJsonPath('data.result', 'PASSED');

            $this->assertDatabaseHas('surveys', [
                'survey_id' => $survey->survey_id,
                'result' => 'PASSED',
            ]);
        });

        it('validates enum on update', function () {
            $survey = EloquentSurvey::create([
                'date' => now()->toDateString(),
                'result' => 'PENDING',
                'user_id' => $this->user->user_id,
                'follow_up_file_id' => $this->fuf->follow_up_file_id,
            ]);

            $this->putJson('/api/surveys/'.$survey->survey_id, ['result' => 'NOPE'])
                ->assertStatus(422)
                ->assertJsonValidationErrors(['result']);
        });

        it('returns 404 for non-existent survey', function () {
            $this->putJson('/api/surveys/999999', ['result' => 'PASSED'])
                ->assertStatus(404);
        });
    });

    describe('DELETE /api/surveys/{id} - Delete Survey', function () {
        it('deletes survey successfully', function () {
            $survey = EloquentSurvey::create([
                'date' => now()->toDateString(),
                'result' => 'PENDING',
                'user_id' => $this->user->user_id,
                'follow_up_file_id' => $this->fuf->follow_up_file_id,
            ]);

            $this->deleteJson('/api/surveys/'.$survey->survey_id)
                ->assertStatus(200)
                ->assertJson(['message' => 'Survey deleted successfully.']);

            $this->assertDatabaseMissing('surveys', ['survey_id' => $survey->survey_id]);
        });

        it('returns 404 for non-existent survey', function () {
            $this->deleteJson('/api/surveys/999999')->assertStatus(404);
        });
    });

    describe('Authentication & Authorization', function () {
        it('requires authentication for all survey endpoints', function () {
            $this->app->make('auth')->forgetGuards();

            $this->getJson('/api/surveys')->assertStatus(401);
            $this->postJson('/api/surveys', [])->assertStatus(401);
            $this->getJson('/api/surveys/1')->assertStatus(401);
            $this->putJson('/api/surveys/1', [])->assertStatus(401);
            $this->deleteJson('/api/surveys/1')->assertStatus(401);
        });
    });
});
