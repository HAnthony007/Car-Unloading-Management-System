<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * @var \App\Models\Role|null
     */
    protected $role;

    /**
     * @var \App\Models\User|null
     */
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Set application key for testing
        config(['app.key' => 'base64:test-key-for-testing-only-not-for-production']);
        // Ensure a stable app URL during tests to make generated asset URLs deterministic
        config(['app.url' => 'http://localhost']);
    }
}
