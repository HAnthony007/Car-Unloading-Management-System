<?php

namespace Database\Seeders;

use App\Models\FollowUpFile;
use App\Models\PortCall;
use Illuminate\Database\Seeder;

class FollowUpFileSeeder extends Seeder
{
    public function run(): void
    {
        $portCallIds = PortCall::pluck('port_call_id');
        if ($portCallIds->isEmpty()) {
            $pc = PortCall::factory()->create();
            $portCallIds = collect([$pc->port_call_id]);
        }

        FollowUpFile::factory()
            ->count(5)
            ->state(fn () => ['port_call_id' => $portCallIds->random()])
            ->create();
    }
}
