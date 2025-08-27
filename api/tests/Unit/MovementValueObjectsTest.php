<?php

use App\Domain\Movement\ValueObjects\MovementId;
use App\Domain\Movement\ValueObjects\VehicleLocation;

it('validates MovementId and exposes value', function () {
    $id = new MovementId(10);
    expect($id->getValue())->toBe(10)->and((string) $id)->toBe('10');
});

it('rejects invalid MovementId', function () {
    new MovementId(0);
})->throws(InvalidArgumentException::class);

it('vehicle location normalizes empty strings to null and exposes value', function () {
    $loc1 = new VehicleLocation(null);
    $loc2 = new VehicleLocation('  ');
    $loc3 = new VehicleLocation('Yard A');

    expect($loc1->getValue())->toBeNull()
        ->and($loc1->hasValue())->toBeFalse()
        ->and($loc2->getValue())->toBeNull()
        ->and($loc2->hasValue())->toBeFalse()
        ->and($loc3->getValue())->toBe('Yard A')
        ->and($loc3->hasValue())->toBeTrue();
});
