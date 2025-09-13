<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

/**
 * Base TestCase for application feature & unit tests.
 *
 * @method \Illuminate\Testing\TestResponse get(string $uri, array $headers = [])
 * @method \Illuminate\Testing\TestResponse post(string $uri, array $data = [], array $headers = [])
 * @method \Illuminate\Testing\TestResponse put(string $uri, array $data = [], array $headers = [])
 * @method \Illuminate\Testing\TestResponse delete(string $uri, array $data = [], array $headers = [])
 * @method \Illuminate\Testing\TestResponse json(string $method, string $uri, array $data = [], array $headers = [])
 */
abstract class TestCase extends BaseTestCase
{
    /**
     * Creates the application.
     */
    public function createApplication(): \Illuminate\Foundation\Application
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }
}
