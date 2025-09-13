<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Order matters for FK integrity
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            DockSeeder::class,
            // VesselSeeder::class,
            // PortCallSeeder::class,
            // DischargeSeeder::class,
            // VehicleSeeder::class,
            ParkingSeeder::class,
            SurveyTemplateSeeder::class,
            // FollowUpFileSeeder::class,
            // SurveySeeder::class,
            // SurveyCheckpointSeeder::class,
            // SurveyCheckpointStepSeeder::class,
            // PhotoSeeder::class,
            // DocumentSeeder::class,
            // MovementSeeder::class,
        ]);
    }
}
