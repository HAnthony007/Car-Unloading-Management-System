<?php

use Illuminate\Testing\Fluent\AssertableJson;

it('returns JSON 401 for unauthenticated access to protected route', function () {
    $response = $this->getJson('/api/users');

    $response->assertUnauthorized();

    $response->assertJson(fn (AssertableJson $json) => $json->has('error')
        ->where('error.code', 401)
        ->where('error.message', 'Unauthenticated.')
    );
});

it('returns JSON 405 for method not allowed on api route', function () {
    // Known route POST /api/users exists, so sending PATCH should yield 405
    $response = $this->patchJson('/api/users');

    // In case of some global fallbacks, ensure it's not 404 but 405
    $response->assertStatus(405);

    $response->assertJson(fn (AssertableJson $json) => $json->has('error')
        ->where('error.code', 405)
        ->where('error.message', 'Method Not Allowed.')
    );
});
