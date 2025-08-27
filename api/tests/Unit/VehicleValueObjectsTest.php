<?php

use App\Domain\Vehicle\ValueObjects\VehicleId;
use App\Domain\Vehicle\ValueObjects\Vin;

it('normalizes VIN to uppercase and trims', function () {
    $vin = new Vin('  abcd123  ');
    expect($vin->getValue())->toBe('ABCD123');
});

it('throws on invalid VIN', function () {
    new Vin('');
})->throws(InvalidArgumentException::class);

it('accepts positive vehicle id and rejects non-positive', function () {
    $id = new VehicleId(10);
    expect($id->getValue())->toBe(10);

    new VehicleId(0);
})->throws(InvalidArgumentException::class);
