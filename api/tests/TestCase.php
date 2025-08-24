<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Set application key for testing
        config(['app.key' => 'base64:test-key-for-testing-only-not-for-production']);
    // Ensure a stable app URL during tests to make generated asset URLs deterministic
    config(['app.url' => 'http://localhost']);
    }
}
