<?php

use App\Models\Survey;
use App\Models\SurveyCheckpoint;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->artisan('migrate:fresh');
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'sanctum');

    Storage::fake('r2');
});

it('updates checkpoint status successfully', function () {
    $survey = Survey::factory()->create();
    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
        'status' => 'pending',
    ]);

    // Refresh to get the checkpoint_id after creation
    $checkpoint->refresh();

    $response = $this->putJson("/api/inspection-checkpoints/{$checkpoint->checkpoint_id}/status", [
        'status' => 'ok',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Statut du checkpoint mis à jour avec succès',
        'data' => [
            'checkpoint_id' => $checkpoint->checkpoint_id,
            'status' => 'ok',
        ],
    ]);

    $this->assertDatabaseHas('survey_checkpoints', [
        'checkpoint_id' => $checkpoint->checkpoint_id,
        'result_checkpoint' => 'ok',
    ]);
});

it('validates status field', function () {
    $survey = Survey::factory()->create();
    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
    ]);

    $checkpoint->refresh();

    $response = $this->putJson("/api/inspection-checkpoints/{$checkpoint->checkpoint_id}/status", [
        'status' => 'invalid_status',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['status']);
});

it('updates checkpoint comment successfully', function () {
    $survey = Survey::factory()->create();
    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
        'comment' => null,
    ]);

    $comment = 'This is a test comment';

    $response = $this->putJson("/api/inspection-checkpoints/{$checkpoint->checkpoint_id}/comment", [
        'comment' => $comment,
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Commentaire du checkpoint mis à jour avec succès',
        'data' => [
            'checkpoint_id' => $checkpoint->checkpoint_id,
            'comment' => $comment,
        ],
    ]);

    $this->assertDatabaseHas('survey_checkpoints', [
        'checkpoint_id' => $checkpoint->checkpoint_id,
        'comment_checkpoint' => $comment,
    ]);
});

it('validates comment field', function () {
    $survey = Survey::factory()->create();
    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
    ]);

    $response = $this->putJson("/api/inspection-checkpoints/{$checkpoint->checkpoint_id}/comment", [
        'comment' => str_repeat('a', 1001), // Too long
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['comment']);
});

it('adds photo to checkpoint successfully', function () {
    $survey = Survey::factory()->create();
    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
        'photos' => json_encode([]),
    ]);

    $file = UploadedFile::fake()->image('test.jpg');

    $response = $this->postJson("/api/inspection-checkpoints/{$checkpoint->checkpoint_id}/photos", [
        'photo' => $file,
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Photo ajoutée avec succès',
    ]);

    $response->assertJsonStructure([
        'data' => [
            'checkpoint_id',
            'photo_url',
            'photos',
            'updated_at',
        ],
    ]);
});

it('validates photo file', function () {
    $survey = Survey::factory()->create();
    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
    ]);

    $response = $this->postJson("/api/inspection-checkpoints/{$checkpoint->checkpoint_id}/photos", [
        'photo' => 'not_a_file',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['photo']);
});

it('removes photo from checkpoint successfully', function () {
    $survey = Survey::factory()->create();
    $photos = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'];
    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
        'photos' => json_encode($photos),
    ]);

    $response = $this->deleteJson("/api/inspection-checkpoints/{$checkpoint->checkpoint_id}/photos/0");

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Photo supprimée avec succès',
    ]);

    $response->assertJsonStructure([
        'data' => [
            'checkpoint_id',
            'photos',
            'updated_at',
        ],
    ]);
});

it('confirms inspection successfully', function () {
    $survey = Survey::factory()->create([
        'overall_status' => 'IN_PROGRESS',
    ]);

    // Create checkpoints with completed status
    SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
        'status' => 'ok',
    ]);

    SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
        'status' => 'defaut',
    ]);

    $response = $this->postJson("/api/inspection-checkpoints/{$survey->survey_id}/confirm");

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Inspection confirmée avec succès',
    ]);

    $response->assertJsonStructure([
        'data' => [
            'inspection_id',
            'status',
            'completed_at',
        ],
    ]);
});

it('requires authentication', function () {
    // Ensure middleware runs and no user is authenticated
    $this->withMiddleware();
    app('auth')->forgetGuards();

    $response = $this->putJson('/api/inspection-checkpoints/1/status', [
        'status' => 'ok',
    ]);

    $response->assertUnauthorized();
});

it('handles checkpoint not found', function () {
    $response = $this->putJson('/api/inspection-checkpoints/999/status', [
        'status' => 'ok',
    ]);

    $response->assertStatus(500);
    $response->assertJson([
        'success' => false,
        'message' => 'Erreur lors de la mise à jour du statut',
    ]);
});
