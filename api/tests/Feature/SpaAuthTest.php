<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function originHeader(): array
{
    return ['Origin' => 'http://localhost:5173'];
}

it('authenticates SPA via cookies and can logout', function (): void {
    // Arrange: user with known password
    $role = Role::factory()->create();
    /** @var User $user */
    $user = User::factory()->create([
        'role_id' => $role->role_id,
        'password' => bcrypt('password'),
    ]);

    // Step 1: Get CSRF cookie (XSRF-TOKEN) and session cookie
    $csrfResponse = \Pest\Laravel\get('/sanctum/csrf-cookie', originHeader());

    $xsrfCookie = $csrfResponse->getCookie('XSRF-TOKEN');
    expect($xsrfCookie)->not->toBeNull();

    $sessionCookieName = config('session.cookie');

    // Step 2: SPA login with CSRF header / cookies
    $loginResponse = \Pest\Laravel\postJson('/api/auth/spa/login', [
        'email' => $user->email,
        'password' => 'password',
    ], array_merge([
        'X-XSRF-TOKEN' => $xsrfCookie->getValue(),
        'Accept' => 'application/json',
    ], originHeader()));

    $loginResponse->assertSuccessful()
        ->assertJsonPath('data.user.email', $user->email);

    // Grab the fresh session cookie returned by login
    $authSessionCookie = $loginResponse->getCookie($sessionCookieName);
    expect($authSessionCookie)->not->toBeNull();

    // Step 3: Access protected route using session cookie
    $meResponse = \Pest\Laravel\getJson('/api/auth/me', array_merge([
        'Accept' => 'application/json',
    ], originHeader()));

    $meResponse->assertSuccessful()
        ->assertJsonPath('data.user.email', $user->email);

    // Step 4: Refresh CSRF cookie and logout (invalidate session)
    $csrf2 = \Pest\Laravel\get('/sanctum/csrf-cookie', originHeader());
    $xsrf2 = $csrf2->getCookie('XSRF-TOKEN');
    expect($xsrf2)->not->toBeNull();

    $logoutResponse = \Pest\Laravel\postJson('/api/auth/spa/logout', [], array_merge([
        'Accept' => 'application/json',
        'X-XSRF-TOKEN' => $xsrf2->getValue(),
    ], originHeader()));

    $logoutResponse->assertSuccessful();
});

it('requires authentication for /auth/me when not logged in via SPA', function (): void {
    $response = \Pest\Laravel\getJson('/api/auth/me', array_merge([
        'Accept' => 'application/json',
    ], originHeader()));

    $response->assertStatus(401);
});
