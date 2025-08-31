<?php

namespace Database\Seeders;

use App\Models\Parking;
use Illuminate\Database\Seeder;

class ParkingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Parking::insert([
            // Parking number is now per-vehicle (on movements). Keeping optional example for Mahasarika.
            ['parking_name' => 'Mahasarika', 'location' => 'zone 1', 'capacity' => 40, 'parking_number' => null],
            ['parking_name' => 'Tampon', 'location' => 'zone 2', 'capacity' => 30, 'parking_number' => null],
            ['parking_name' => 'C1', 'location' => 'zone 3', 'capacity' => 20, 'parking_number' => null],
            ['parking_name' => 'Pergola', 'location' => 'zone 4', 'capacity' => 10, 'parking_number' => null],
        ]);
    }
}
