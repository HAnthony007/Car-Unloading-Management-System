<?php

return [
    'app_key' => 'base64:test-key-for-testing-only-not-for-production',
    'database' => [
        'default' => 'sqlite',
        'connections' => [
            'sqlite' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
            ],
        ],
    ],
];
