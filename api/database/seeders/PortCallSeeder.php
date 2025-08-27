<?php

namespace Database\Seeders;

use App\Models\PortCall;
use Illuminate\Database\Seeder;

class PortCallSeeder extends Seeder
{
    public function run(): void
    {
        PortCall::factory()->count(5)->create();
    }
}
