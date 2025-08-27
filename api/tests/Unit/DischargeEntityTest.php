<?php

use App\Domain\Discharge\Entities\Discharge;
use App\Domain\Discharge\ValueObjects\DateTimeValue;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\PortCall\ValueObjects\PortCallId;
use Carbon\Carbon;

it('serializes to array correctly', function () {
    $entity = new Discharge(
        dischargeId: new DischargeId(10),
        dischargeDate: new DateTimeValue(Carbon::parse('2025-08-27T10:00:00Z')),
        portCallId: new PortCallId(5),
        createdAt: Carbon::parse('2025-08-27T10:05:00Z'),
        updatedAt: Carbon::parse('2025-08-27T10:10:00Z'),
    );

    $arr = $entity->toArray();

    expect($arr['discharge_id'])->toBe(10)
        ->and($arr['port_call_id'])->toBe(5)
        ->and($arr['discharge_date'])->toBe('2025-08-27T10:00:00+00:00')
        ->and($arr['created_at'])->toBe('2025-08-27T10:05:00+00:00')
        ->and($arr['updated_at'])->toBe('2025-08-27T10:10:00+00:00');
});
