<?php

namespace Database\Seeders;

use App\Models\Dock;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Dock::insert([
            ['dock_name' => 'B1', 'location' => 'Location 1'],
            ['dock_name' => 'C1', 'location' => 'Location 2'],
            ['dock_name' => 'Cheritte', 'location' => 'Location 3'],
        ]);
    }
}
