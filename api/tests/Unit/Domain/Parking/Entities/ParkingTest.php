<?php

use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\ValueObjects\Capacity;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\ParkingNumber;
use Carbon\Carbon;

test('should create a parking entity with all properties', function () {
    $parking = new Parking(
        parkingId: new ParkingId(1),
        parkingName: new ParkingName('Test Parking'),
        location: new Location('Test Location'),
        capacity: new Capacity(100),
        parkingNumber: new ParkingNumber('P-123'),
        createdAt: Carbon::now(),
        updatedAt: Carbon::now()
    );

    expect($parking->getParkingId()->getValue())->toBe(1);
    expect($parking->getParkingName()->getValue())->toBe('Test Parking');
    expect($parking->getLocation()->getValue())->toBe('Test Location');
    expect($parking->getCapacity()->getValue())->toBe(100);
    expect($parking->getParkingNumber()->getValue())->toBe('P-123');
    expect($parking->getCreatedAt())->toBeInstanceOf(Carbon::class);
    expect($parking->getUpdatedAt())->toBeInstanceOf(Carbon::class);
});

test('should create a parking entity without optional properties', function () {
    $parking = new Parking(
        parkingId: null,
        parkingName: new ParkingName('Test Parking'),
        location: new Location('Test Location'),
        capacity: new Capacity(100)
    );

    expect($parking->getParkingId())->toBeNull();
    expect($parking->getParkingName()->getValue())->toBe('Test Parking');
    expect($parking->getLocation()->getValue())->toBe('Test Location');
    expect($parking->getCapacity()->getValue())->toBe(100);
    expect($parking->getParkingNumber())->toBeNull();
    expect($parking->getCreatedAt())->toBeNull();
    expect($parking->getUpdatedAt())->toBeNull();
});

test('should convert to array correctly', function () {
    $now = Carbon::now();
    $parking = new Parking(
        parkingId: new ParkingId(1),
        parkingName: new ParkingName('Test Parking'),
        location: new Location('Test Location'),
        capacity: new Capacity(100),
        parkingNumber: new ParkingNumber('P-123'),
        createdAt: $now,
        updatedAt: $now
    );

    $array = $parking->toArray();

    expect($array)->toBeArray();
    expect($array['parking_id'])->toBe(1);
    expect($array['parking_name'])->toBe('Test Parking');
    expect($array['location'])->toBe('Test Location');
    expect($array['capacity'])->toBe(100);
    expect($array['parking_number'])->toBe('P-123');
    expect($array['created_at'])->toBe($now->toISOString());
    expect($array['updated_at'])->toBe($now->toISOString());
});

test('should throw exception for Mahasarika parking without parking number', function () {
    expect(fn () => new Parking(
        parkingId: new ParkingId(1),
        parkingName: new ParkingName('Mahasarika'),
        location: new Location('Location'),
        capacity: new Capacity(100),
        parkingNumber: null
    ))->toThrow(InvalidArgumentException::class, 'Parking number is required for Mahasarika parking.');
});

test('should not throw exception for non-Mahasarika parking without parking number', function () {
    $parking = new Parking(
        parkingId: new ParkingId(2),
        parkingName: new ParkingName('Other Parking'),
        location: new Location('Location'),
        capacity: new Capacity(100),
        parkingNumber: null
    );

    expect($parking)->toBeInstanceOf(Parking::class);
});
