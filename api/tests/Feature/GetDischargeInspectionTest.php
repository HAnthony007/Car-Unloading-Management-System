<?php

// TestCase already bound globally in Pest.php

use App\Models\Discharge;
use App\Models\Survey;
use App\Models\SurveyCheckpoint;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function authenticate(): User
{
    /** @var User $user */
    $user = User::factory()->create();
    test()->actingAs($user);

    return $user;
}

it('returns 404 when discharge does not exist', function () {
    authenticate();

    $response = \Pest\Laravel\get('/api/discharges/999999/inspection');
    $response->assertStatus(404)->assertJson(['error' => 'Discharge not found.']);
});

it('returns 404 when inspection not initialized', function () {
    authenticate();
    $discharge = Discharge::factory()->create();

    $response = \Pest\Laravel\get("/api/discharges/{$discharge->discharge_id}/inspection");
    $response->assertStatus(404)->assertJson(['error' => 'Inspection not initialized for this discharge.']);
});

it('returns surveys and checkpoints for a discharge inspection', function () {
    authenticate();
    $discharge = Discharge::factory()->create();
    $survey = Survey::factory()->create(['discharge_id' => $discharge->discharge_id]);
    SurveyCheckpoint::factory()->count(3)->create(['survey_id' => $survey->survey_id]);

    $response = \Pest\Laravel\get("/api/discharges/{$discharge->discharge_id}/inspection");
    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                [
                    'survey_id', 'survey_name', 'overall_status', 'survey_description', 'survey_date',
                    'checkpoints' => [
                        [
                            'checkpoint_id', 'title_checkpoint', 'description_checkpoint', 'comment_checkpoint', 'result_checkpoint', 'order_checkpoint',
                        ],
                    ],
                ],
            ],
        ]);
});
