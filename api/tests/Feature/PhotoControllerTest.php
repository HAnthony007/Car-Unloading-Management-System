<?php

namespace Tests\Feature;

use App\Models\Discharge;
use App\Models\Dock;
use App\Models\FollowUpFile;
use App\Models\Photo as EloquentPhoto;
use App\Models\PortCall;
use App\Models\Role;
use App\Models\Survey;
use App\Models\SurveyCheckpoint;
use App\Models\User as EloquentUser;
use App\Models\Vessel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PhotoControllerTest extends TestCase
{
    use RefreshDatabase;

    protected EloquentUser $user;

    private function seedGraphForPhoto(): array
    {
        $vessel = Vessel::query()->create([
            'imo_no' => 'IMO'.random_int(10000, 99999),
            'vessel_name' => 'Test Vessel',
            'flag' => 'FR',
        ]);

        $dock = Dock::query()->create([
            'dock_name' => 'Dock A',
            'location' => 'Zone 1',
        ]);

        $pc = PortCall::query()->create([
            'vessel_agent' => 'Agent X',
            'origin_port' => 'Origin',
            'arrival_date' => now(),
            'vessel_id' => $vessel->vessel_id,
            'dock_id' => $dock->dock_id,
        ]);

        $discharge = Discharge::query()->create([
            'discharge_date' => now(),
            'port_call_id' => $pc->port_call_id,
        ]);

        $vehicleId = DB::table('vehicles')->insertGetId([
            'vin' => 'VIN'.random_int(10000, 99999),
            'make' => 'Make',
            'model' => 'Model',
            'type' => 'Type',
            'weight' => '1000',
            'vehicle_condition' => 'NEW',
            'origin_country' => 'FR',
            'is_primed' => 0,
            'discharge_id' => $discharge->discharge_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $fuf = FollowUpFile::query()->create([
            'bill_of_lading' => 'BOL'.random_int(1000, 9999),
            'status' => 'OPEN',
            'vehicle_id' => $vehicleId,
            'port_call_id' => $pc->port_call_id,
        ]);

        $survey = Survey::query()->create([
            'date' => now()->toDateString(),
            'result' => 'PENDING',
            'user_id' => $this->user->user_id,
            'follow_up_file_id' => $fuf->follow_up_file_id,
        ]);

        $checkpoint = SurveyCheckpoint::query()->create([
            'title' => 'Checkpoint',
            'comment' => 'Ok',
            'survey_id' => $survey->survey_id,
        ]);

        return [$fuf->follow_up_file_id, $vehicleId, $checkpoint->checkpoint_id];
    }

    protected function setUp(): void
    {
        parent::setUp();
        $role = Role::factory()->create([
            'role_name' => 'User',
            'role_description' => 'Regular user',
        ]);
        $this->user = EloquentUser::factory()->create([
            'role_id' => $role->role_id,
            'email_verified_at' => now(),
        ]);
        Sanctum::actingAs($this->user);
    }

    public function test_lists_photos_with_filters(): void
    {
        [$fufId, $vehicleId, $checkpointId] = $this->seedGraphForPhoto();

        EloquentPhoto::query()->create([
            'photo_path' => 'path/a.jpg',
            'taken_at' => now()->subDay(),
            'photo_description' => 'Front',
            'follow_up_file_id' => $fufId,
            'checkpoint_id' => null,
        ]);
        // Vehicle filter removed; filter by follow_up_file_id instead
        $response = $this->getJson('/api/photos?follow_up_file_id='.$fufId.'&per_page=1&page=1');
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [[
                    'photo_id', 'photo_path', 'taken_at', 'photo_description', 'follow_up_file_id', 'checkpoint_id',
                ]],
                'meta' => ['current_page', 'from', 'last_page', 'path', 'per_page', 'to', 'total'],
            ]);
    }

    public function test_creates_a_photo(): void
    {
        [$fufId, $vehicleId, $checkpointId] = $this->seedGraphForPhoto();
        $payload = [
            'photo_path' => 'path/b.jpg',
            'taken_at' => now()->toDateTimeString(),
            'photo_description' => 'Back',
            'follow_up_file_id' => $fufId,
            // Only one of follow_up_file_id or checkpoint_id
        ];

        $res = $this->postJson('/api/photos', $payload);
        $res->assertCreated()->assertJsonPath('data.photo_path', 'path/b.jpg');

        $this->assertDatabaseHas('photos', [
            'photo_path' => 'path/b.jpg',
            'follow_up_file_id' => $fufId,
            'checkpoint_id' => null,
        ]);
    }

    public function test_validates_when_creating(): void
    {
        $res = $this->postJson('/api/photos', []);
        $res->assertStatus(422)
            ->assertJsonValidationErrors(['taken_at', 'follow_up_file_id', 'checkpoint_id']);
    }

    public function test_creates_photo_without_photo_path_then_uploads(): void
    {
        [$fufId, $vehicleId, $checkpointId] = $this->seedGraphForPhoto();
        $payload = [
            // 'photo_path' omitted on purpose
            'taken_at' => now()->toDateTimeString(),
            'photo_description' => 'Front no path yet',
            'follow_up_file_id' => $fufId,
            // Only one of follow_up_file_id or checkpoint_id
        ];

        $res = $this->postJson('/api/photos', $payload);
        $res->assertCreated();

        $photoId = $res->json('data.photo_id');
        $this->assertDatabaseHas('photos', [
            'photo_id' => $photoId,
            'photo_path' => '',
        ]);

        Storage::fake('r2');
        $file = UploadedFile::fake()->image('later.jpg', 120, 120);
        $upload = $this->postJson("/api/photos/{$photoId}/upload", [
            'file' => $file,
            'directory' => 'photos/follow-up/'.$fufId,
        ]);
        $upload->assertCreated();

        $path = $upload->json('data.photo_path');
        $this->assertTrue(Storage::disk('r2')->exists($path));
    }

    public function test_shows_a_photo(): void
    {
        [$fufId, $vehicleId, $checkpointId] = $this->seedGraphForPhoto();
        $id = EloquentPhoto::query()->insertGetId([
            'photo_path' => 'path/c.jpg',
            'taken_at' => now(),
            'photo_description' => 'Side',
            'follow_up_file_id' => $fufId,
            'checkpoint_id' => $checkpointId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $res = $this->getJson('/api/photos/'.$id);
        $res->assertOk()->assertJsonPath('data.photo_id', $id);
    }

    public function test_updates_a_photo(): void
    {
        [$fufId, $vehicleId, $checkpointId] = $this->seedGraphForPhoto();
        $id = EloquentPhoto::query()->insertGetId([
            'photo_path' => 'path/d.jpg',
            'taken_at' => now(),
            'photo_description' => 'Old',
            'follow_up_file_id' => $fufId,
            'checkpoint_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $res = $this->putJson('/api/photos/'.$id, ['photo_description' => 'New']);
        $res->assertOk()->assertJsonPath('data.photo_description', 'New');

        $this->assertDatabaseHas('photos', [
            'photo_id' => $id,
            'photo_description' => 'New',
        ]);
    }

    public function test_deletes_a_photo(): void
    {
        [$fufId, $vehicleId, $checkpointId] = $this->seedGraphForPhoto();
        $id = EloquentPhoto::query()->insertGetId([
            'photo_path' => 'path/e.jpg',
            'taken_at' => now(),
            'photo_description' => 'Tmp',
            'follow_up_file_id' => $fufId,
            'checkpoint_id' => $checkpointId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $res = $this->deleteJson('/api/photos/'.$id);
        $res->assertOk()->assertJson(['message' => 'Photo deleted successfully.']);

        $this->assertDatabaseMissing('photos', ['photo_id' => $id]);
    }

    public function test_requires_authentication(): void
    {
        app('auth')->forgetGuards();
        $this->getJson('/api/photos')->assertStatus(401);
        $this->postJson('/api/photos', [])->assertStatus(401);
        $this->getJson('/api/photos/1')->assertStatus(401);
        $this->putJson('/api/photos/1', [])->assertStatus(401);
        $this->deleteJson('/api/photos/1')->assertStatus(401);
    }

    public function test_uploads_photo_file_to_r2_and_returns_url(): void
    {
        [$fufId, $vehicleId, $checkpointId] = $this->seedGraphForPhoto();
        $photo = EloquentPhoto::query()->create([
            'photo_path' => 'photos/misc/placeholder.jpg',
            'taken_at' => now(),
            'photo_description' => 'Tmp',
            'follow_up_file_id' => $fufId,
            'checkpoint_id' => $checkpointId,
        ]);

        Storage::fake('r2');

        $file = UploadedFile::fake()->image('x.jpg', 100, 100);
        $res = $this->postJson('/api/photos/'.$photo->photo_id.'/upload', [
            'file' => $file,
            'directory' => 'photos/follow-up/'.$fufId,
            'visibility' => 'public',
        ]);

        $res->assertCreated()
            ->assertJsonStructure(['data' => ['photo_path', 'url']]);

        $path = $res->json('data.photo_path');
        $this->assertTrue(Storage::disk('r2')->exists($path));
    }

    public function test_gets_temporary_url_for_photo(): void
    {
        [$fufId, $vehicleId, $checkpointId] = $this->seedGraphForPhoto();
        $photo = EloquentPhoto::query()->create([
            'photo_path' => 'photos/follow-up/'.$fufId.'/a.jpg',
            'taken_at' => now(),
            'photo_description' => 'Tmp',
            'follow_up_file_id' => $fufId,
            'checkpoint_id' => $checkpointId,
        ]);

        Storage::fake('r2');
        Storage::disk('r2')->put($photo->photo_path, 'content');

        $res = $this->getJson('/api/photos/'.$photo->photo_id.'/url?temporary=1&expires=600');
        $res->assertOk()->assertJsonStructure(['data' => ['url', 'expires_in']]);
        $this->assertSame(600, $res->json('data.expires_in'));
    }

    public function test_upload_photo_nested_under_follow_up_file(): void
    {
        [$fufId, $vehicleId, $checkpointId] = $this->seedGraphForPhoto();

        Storage::fake('r2');
        $file = UploadedFile::fake()->image('nested.jpg', 128, 128);

        $res = $this->postJson("/api/follow-up-files/{$fufId}/photos", [
            'file' => $file,
            'taken_at' => now()->toDateTimeString(),
            'photo_description' => 'Nested upload',
            'checkpoint_id' => $checkpointId,
            'visibility' => 'public',
        ]);

        $res->assertCreated()->assertJsonStructure(['data' => ['photo_id', 'photo_path', 'url', 'follow_up_file_id', 'checkpoint_id']]);

        $photoId = $res->json('data.photo_id');
        $path = $res->json('data.photo_path');
        $this->assertNotEmpty($photoId);
        $this->assertTrue(Storage::disk('r2')->exists($path));

        $this->assertDatabaseHas('photos', [
            'photo_id' => $photoId,
            'follow_up_file_id' => $fufId,
            'checkpoint_id' => $checkpointId,
        ]);
    }
}
