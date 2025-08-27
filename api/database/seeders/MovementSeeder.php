<?php

namespace Database\Seeders;

use App\Models\Movement;
use Illuminate\Database\Seeder;

class MovementSeeder extends Seeder
{
    public function run(): void
    {
        Movement::factory()->count(40)->create();
    }
}
