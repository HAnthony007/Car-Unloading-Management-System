<?php

namespace Database\Seeders;

use App\Models\Vessel;
use Illuminate\Database\Seeder;

class VesselSeeder extends Seeder
{
    public function run(): void
    {
        Vessel::factory()->count(5)->create();
    }
}
