<?php

use App\Models\User;

beforeEach(function () {
    $this->artisan('migrate:fresh');
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'sanctum');
});

it('can access inspection checkpoint routes', function () {
    $response = $this->getJson('/api/inspection-checkpoints/1/status');

    // Should not be 404, should be 405 (Method Not Allowed) or 500 (Server Error)
    expect($response->status())->not->toBe(404);
});

it('can access inspection checkpoint status route', function () {
    $response = $this->putJson('/api/inspection-checkpoints/1/status', [
        'status' => 'ok',
    ]);

    // Should not be 404, should be 500 (Server Error) because checkpoint doesn't exist
    expect($response->status())->not->toBe(404);
});
