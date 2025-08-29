<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

function makeAuthedUser(): User
{
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);
    Sanctum::actingAs($user);

    return $user;
}

it('uploads an avatar', function (): void {
    Storage::fake('r2');

    $user = makeAuthedUser();

    $file = UploadedFile::fake()->image('avatar.png', 100, 100);

    $response = \Pest\Laravel\postJson("/api/users/{$user->user_id}/avatar", [
        'avatar' => $file,
    ]);

    $response->assertCreated()
        ->assertJsonStructure([
            'message',
            'data' => ['path', 'url'],
        ]);

    // The repository generates a uuid path under avatars/{id}
    $path = $response->json('data.path');
    expect($path)->toStartWith("avatars/{$user->user_id}/");

    // The R2 disk should contain the file
    expect(Storage::disk('r2')->exists($path))->toBeTrue();
});

it('requires auth for avatar endpoints', function (): void {
    Storage::fake('r2');
    $role = Role::factory()->create();
    $user = User::factory()->create(['role_id' => $role->role_id]);

    \Pest\Laravel\postJson("/api/users/{$user->user_id}/avatar", [])->assertUnauthorized();
    \Pest\Laravel\deleteJson("/api/users/{$user->user_id}/avatar")->assertUnauthorized();
    \Pest\Laravel\getJson("/api/users/{$user->user_id}/avatar")->assertUnauthorized();
});

it('validates avatar upload', function (): void {
    Storage::fake('r2');
    $user = makeAuthedUser();

    $response = \Pest\Laravel\postJson("/api/users/{$user->user_id}/avatar", [
        'avatar' => 'not-a-file',
    ]);

    $response->assertUnprocessable()
        ->assertJsonStructure(['message', 'errors' => ['avatar']]);
});

it('deletes an existing avatar', function (): void {
    Storage::fake('r2');
    $user = makeAuthedUser();

    // First upload
    $file = UploadedFile::fake()->image('avatar.png');
    $upload = \Pest\Laravel\postJson("/api/users/{$user->user_id}/avatar", ['avatar' => $file])->assertCreated();
    $path = $upload->json('data.path');

    // Then delete
    $delete = \Pest\Laravel\deleteJson("/api/users/{$user->user_id}/avatar");
    $delete->assertOk()
        ->assertJsonPath('data.success', true);

    expect(Storage::disk('r2')->exists($path))->toBeFalse();
});

it('returns false deleting when no avatar set', function (): void {
    Storage::fake('r2');
    $user = makeAuthedUser();

    $delete = \Pest\Laravel\deleteJson("/api/users/{$user->user_id}/avatar");
    $delete->assertOk()
        ->assertJsonPath('data.success', false);
});

it('gets avatar URL', function (): void {
    Storage::fake('r2');
    $user = makeAuthedUser();

    // Upload first
    $file = UploadedFile::fake()->image('avatar.png');
    $upload = \Pest\Laravel\postJson("/api/users/{$user->user_id}/avatar", ['avatar' => $file]);
    $upload->assertCreated();

    $get = \Pest\Laravel\getJson("/api/users/{$user->user_id}/avatar");

    $get->assertOk()
        ->assertJsonStructure(['data' => ['url']]);
});
