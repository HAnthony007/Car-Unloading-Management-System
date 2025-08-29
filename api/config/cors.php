<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // Include Sanctum's CSRF cookie endpoint for SPA auth
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],
    // List explicit origins since credentials are enabled (no wildcard allowed with cookies)
    // 'allowed_origins' => [
    //     'http://localhost',
    //     'http://localhost:3000',
    //     'http://localhost:5173',
    //     'http://127.0.0.1:8000',
    //     'http://127.0.0.1:5173',
    //     'https://localhost',
    // ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
