<?php

use App\Domain\Movement\Entities\Movement;
use App\Domain\Movement\ValueObjects\MovementId;
use App\Domain\Movement\ValueObjects\VehicleLocation;
use App\Domain\User\ValueObjects\UserId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use Carbon\Carbon;

it('creates Movement entity and exposes data', function () {
    $movement = new Movement(
        movementId: new MovementId(5),
        note: 'Moved from yard A to yard B',
        timestamp: Carbon::parse('2025-08-01 12:00:00'),
        from: new VehicleLocation('Yard A'),
        to: new VehicleLocation('Yard B'),
        vehicleId: new VehicleId(3),
        userId: new UserId(2),
        createdAt: Carbon::parse('2025-08-01 12:00:00'),
        updatedAt: Carbon::parse('2025-08-02 13:00:00'),
    );

    expect($movement->getMovementId()?->getValue())->toBe(5)
        ->and($movement->getNote())->toBe('Moved from yard A to yard B')
        ->and($movement->getTimestamp()->toDateTimeString())->toBe('2025-08-01 12:00:00')
        ->and($movement->getFrom()->getValue())->toBe('Yard A')
        ->and($movement->getTo()->getValue())->toBe('Yard B')
        ->and($movement->getVehicleId()->getValue())->toBe(3)
        ->and($movement->getUserId()->getValue())->toBe(2);

    $arr = $movement->toArray();
    expect($arr['movement_id'])->toBe(5)
        ->and($arr['note'])->toBe('Moved from yard A to yard B')
        ->and($arr['timestamp'])->toBeString()
        ->and($arr['from'])->toBe('Yard A')
        ->and($arr['to'])->toBe('Yard B')
        ->and($arr['vehicle_id'])->toBe(3)
        ->and($arr['user_id'])->toBe(2)
        ->and($arr['created_at'])->toBeString()
        ->and($arr['updated_at'])->toBeString();
});
