<?php

namespace Database\Seeders;

use App\Models\Discharge;
use Illuminate\Database\Seeder;

class DischargeSeeder extends Seeder
{
    public function run(): void
    {
        Discharge::factory()->count(5)->create();
    }
}
