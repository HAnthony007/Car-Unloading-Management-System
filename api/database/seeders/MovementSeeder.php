<?php

namespace Database\Seeders;

use App\Models\Movement;
use App\Models\Parking;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class MovementSeeder extends Seeder
{
    public function run(): void
    {
        $parkingNames = Parking::query()->pluck('parking_name')->all();
        if (empty($parkingNames)) {
            // Nothing to seed without parkings
            return;
        }

        $userIds = User::query()->pluck('user_id')->all();
        if (empty($userIds)) {
            // Ensure at least one user exists
            return;
        }

        $now = now();
        Vehicle::query()->orderBy('vehicle_id')->get()->each(function (Vehicle $vehicle) use ($parkingNames, $userIds, $now): void {
            $userId = (int) $userIds[array_rand($userIds)];
            $parkingName = (string) $parkingNames[array_rand($parkingNames)];

            // Seed one latest movement per vehicle into a random parking
            Movement::create([
                'note' => 'Seeded to parking '.$parkingName,
                'timestamp' => $now->copy()->subMinutes(random_int(0, 10_000)),
                'from' => 'Gate',
                'to' => $parkingName,
                'vehicle_id' => $vehicle->vehicle_id,
                'user_id' => $userId,
            ]);
        });
    }
}
