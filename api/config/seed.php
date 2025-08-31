<?php

return [
    // Number of users to seed in total (including the fixed admin)
    'users' => [
        'count' => (int) env('SEED_USER_COUNT', 1),
    ],
];
