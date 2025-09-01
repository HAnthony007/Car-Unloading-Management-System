<?php

namespace Database\Seeders;

use App\Models\Discharge;
use App\Models\PortCall;
use Illuminate\Database\Seeder;

class DischargeSeeder extends Seeder
{
    public function run(): void
    {
        $portCallIds = PortCall::pluck('port_call_id');
        if ($portCallIds->isEmpty()) {
            // Fallback: create 1 PortCall to satisfy FK
            $pc = PortCall::factory()->create();
            $portCallIds = collect([$pc->port_call_id]);
        }

        Discharge::factory()
            ->count(5)
            ->state(fn () => ['port_call_id' => $portCallIds->random()])
            ->create();
    }
}
