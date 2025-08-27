<?php

use App\Domain\Dock\ValueObjects\DockId;
use App\Domain\PortCall\Entities\PortCall;
use App\Domain\PortCall\ValueObjects\DateTimeValue;
use App\Domain\PortCall\ValueObjects\OriginPort;
use App\Domain\PortCall\ValueObjects\VesselAgent;
use App\Domain\Vessel\ValueObjects\VesselId;
use Carbon\Carbon;

it('creates a PortCall domain entity and exposes array', function () {
    $pc = new PortCall(
        portCallId: null,
        vesselAgent: new VesselAgent('Agent X'),
        originPort: new OriginPort('Marseille'),
        estimatedArrival: new DateTimeValue(Carbon::parse('2025-08-01 10:00:00')),
        arrivalDate: new DateTimeValue(Carbon::parse('2025-08-02 12:00:00')),
        estimatedDeparture: new DateTimeValue(null),
        departureDate: new DateTimeValue(null),
        vesselId: new VesselId(1),
        dockId: new DockId(1),
    );

    $arr = $pc->toArray();
    expect($arr['vessel_agent'])->toBe('Agent X')
        ->and($arr['origin_port'])->toBe('Marseille')
        ->and($arr['vessel_id'])->toBe(1)
        ->and($arr['dock_id'])->toBe(1);
});
