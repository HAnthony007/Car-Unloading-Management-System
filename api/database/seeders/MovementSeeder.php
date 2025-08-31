<?php

namespace Database\Seeders;

use App\Models\Movement;
use App\Models\Parking;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MovementSeeder extends Seeder
{
    public function run(): void
    {
        $parkings = Parking::query()->get(['parking_name', 'capacity']);
        if ($parkings->isEmpty()) {
            // Nothing to seed without parkings
            return;
        }

        $userIds = User::query()->pluck('user_id')->all();
        if (empty($userIds)) {
            // Ensure at least one user exists
            return;
        }

        // Build initial occupancy based on latest movements already present
        $occupancy = [];
        foreach ($parkings as $p) {
            $occupancy[$p->parking_name] = 0;
        }

        $sub = DB::table('movements')
            ->selectRaw('vehicle_id, MAX(timestamp) as latest_ts')
            ->groupBy('vehicle_id');
        $existing = DB::table('movements')
            ->joinSub($sub, 'latest', function ($join): void {
                $join->on('movements.vehicle_id', '=', 'latest.vehicle_id')
                    ->on('movements.timestamp', '=', 'latest.latest_ts');
            })
            ->select('movements.to')
            ->get();
        foreach ($existing as $row) {
            if ($row->to !== null && array_key_exists($row->to, $occupancy)) {
                $occupancy[$row->to]++;
            }
        }

        $now = now();
        $vehicles = Vehicle::query()->orderBy('vehicle_id')->get();
        foreach ($vehicles as $vehicle) {
            // Determine parkings that still have available capacity
            $available = $parkings->filter(function ($p) use ($occupancy) {
                $current = $occupancy[$p->parking_name] ?? 0;

                return $current < (int) $p->capacity;
            })->values();

            if ($available->isEmpty()) {
                // All parkings are full; skip creating a movement for this vehicle
                continue;
            }

            // Pick a random available parking
            $pick = $available[random_int(0, $available->count() - 1)];
            $parkingName = (string) $pick->parking_name;
            $occupancy[$parkingName] = ($occupancy[$parkingName] ?? 0) + 1;

            $userId = (int) $userIds[array_rand($userIds)];

            $parkingNumber = $parkingName === 'Mahasarika'
                ? ('P'.str_pad((string) random_int(1, 999), 3, '0', STR_PAD_LEFT))
                : null;

            Movement::create([
                'note' => 'Seeded to parking '.$parkingName,
                'timestamp' => $now->copy()->subMinutes(random_int(0, 10_000)),
                'from' => 'Gate',
                'to' => $parkingName,
                'parking_number' => $parkingNumber,
                'vehicle_id' => $vehicle->vehicle_id,
                'user_id' => $userId,
            ]);
        }
    }
}
