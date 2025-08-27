<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::factory()->create(['role_id' => 1]);
});

it('lists discharges (auth required)', function () {
    getJson('/api/discharges')->assertUnauthorized();
});

it('lists discharges by port call id (auth required)', function () {
    getJson('/api/port-calls/1/discharges')->assertUnauthorized();
});

it('lists discharges when authenticated', function () {
    Sanctum::actingAs(User::factory()->create());
    getJson('/api/discharges')
        ->assertOk()
        ->assertJsonStructure(['data']);
});

it('lists discharges by port call id when authenticated', function () {
    Sanctum::actingAs(User::factory()->create());
    getJson('/api/port-calls/123/discharges')
        ->assertOk()
        ->assertJsonStructure(['data']);
});
