<?php

use App\Models\Discharge;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

function makeAuthedAgent(): User {
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    Sanctum::actingAs($user);

    return $user;
}

it('uploads a discharge photo to R2 and returns path and url', function (): void {
    Storage::fake('r2');

    makeAuthedAgent();

    $discharge = Discharge::factory()->create();

    $file = UploadedFile::fake()->image('photo.jpg', 120, 120);

    $response = \Pest\Laravel\postJson("/api/discharges/{$discharge->discharge_id}/photos", [
        'file' => $file,
        'photo_description' => 'Arrivée',
        'visibility' => 'public',
    ]);

    $response->assertCreated()
        ->assertJsonStructure([
            'message',
            'data' => ['photo_id', 'photo_path', 'url', 'discharge_id'],
        ]);

    $path = $response->json('data.photo_path');
    expect($path)->toStartWith('photos/discharges/'.$discharge->discharge_id.'/');
    expect(Storage::disk('r2')->exists($path))->toBeTrue();
});

it('validates discharge photo upload input', function (): void {
    Storage::fake('r2');
    makeAuthedAgent();
    $discharge = Discharge::factory()->create();

    $res = \Pest\Laravel\postJson("/api/discharges/{$discharge->discharge_id}/photos", [
        'file' => 'not-a-file',
    ]);

    $res->assertUnprocessable()
        ->assertJsonStructure(['errors' => ['file']]);
});

it('lists photos for a discharge', function (): void {
    Storage::fake('r2');
    makeAuthedAgent();
    $discharge = Discharge::factory()->create();

    // Upload one photo
    $file = UploadedFile::fake()->image('p.jpg');
    \Pest\Laravel\postJson("/api/discharges/{$discharge->discharge_id}/photos", [
        'file' => $file,
    ])->assertCreated();

    $res = \Pest\Laravel\getJson("/api/discharges/{$discharge->discharge_id}/photos");
    $res->assertOk()->assertJsonStructure(['data', 'meta']);
});

it('returns a temporary URL for a discharge photo', function (): void {
    Storage::fake('r2');
    makeAuthedAgent();
    $discharge = Discharge::factory()->create();
    $file = UploadedFile::fake()->image('p.jpg');
    $create = \Pest\Laravel\postJson("/api/discharges/{$discharge->discharge_id}/photos", [
        'file' => $file,
    ])->assertCreated();
    $photoId = $create->json('data.photo_id');

    $url = \Pest\Laravel\getJson("/api/discharges/{$discharge->discharge_id}/photos/{$photoId}/temporary-url");
    $url->assertOk()->assertJsonStructure(['data' => ['url', 'expires_in']]);
});

it('deletes a discharge photo', function (): void {
    Storage::fake('r2');
    makeAuthedAgent();
    $discharge = Discharge::factory()->create();

    $file = UploadedFile::fake()->image('to-delete.jpg');
    $created = \Pest\Laravel\postJson("/api/discharges/{$discharge->discharge_id}/photos", [
        'file' => $file,
    ])->assertCreated();
    $photoId = $created->json('data.photo_id');
    $path = $created->json('data.photo_path');

    \Pest\Laravel\deleteJson("/api/discharges/{$discharge->discharge_id}/photos/{$photoId}")
        ->assertOk();

    expect(Storage::disk('r2')->exists($path))->toBeFalse();
});

it('lists photos with temporary urls via query', function (): void {
    Storage::fake('r2');
    makeAuthedAgent();
    $discharge = Discharge::factory()->create();
    $file = UploadedFile::fake()->image('temp.jpg');
    \Pest\Laravel\postJson("/api/discharges/{$discharge->discharge_id}/photos", [
        'file' => $file,
    ])->assertCreated();

    $res = \Pest\Laravel\getJson("/api/discharges/{$discharge->discharge_id}/photos?temporary=1&expires=120");
    $res->assertOk()->assertJsonStructure(['data' => [['url']]]);
});

it('accepts up to 10MB images', function (): void {
    Storage::fake('r2');
    makeAuthedAgent();
    $discharge = Discharge::factory()->create();

    // 10MB fake image; Laravel fake size is in kilobytes
    $file = UploadedFile::fake()->create('big.jpg', 10 * 1024, 'image/jpeg');
    \Pest\Laravel\postJson("/api/discharges/{$discharge->discharge_id}/photos", [
        'file' => $file,
    ])->assertCreated();
});

it('uploads multiple photos in batch', function (): void {
    Storage::fake('r2');
    makeAuthedAgent();
    $discharge = Discharge::factory()->create();

    $files = [
        UploadedFile::fake()->image('a.jpg'),
        UploadedFile::fake()->image('b.png'),
    ];

    $res = \Pest\Laravel\postJson("/api/discharges/{$discharge->discharge_id}/photos/batch", [
        'files' => $files,
        'photo_description' => 'Batch',
    ]);

    $res->assertCreated()->assertJsonStructure(['data' => [[ 'photo_id', 'photo_path']]]);

    $items = $res->json('data');
    expect($items)->toHaveCount(2);
    foreach ($items as $it) {
        expect(Storage::disk('r2')->exists($it['photo_path']))->toBeTrue();
    }
});

it('validates batch upload input', function (): void {
    Storage::fake('r2');
    makeAuthedAgent();
    $discharge = Discharge::factory()->create();

    $res = \Pest\Laravel\postJson("/api/discharges/{$discharge->discharge_id}/photos/batch", [
        'files' => 'not-an-array',
    ]);

    $res->assertUnprocessable()->assertJsonStructure(['errors' => ['files']]);
});
