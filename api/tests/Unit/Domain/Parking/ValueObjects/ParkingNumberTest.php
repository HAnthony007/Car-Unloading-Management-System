<?php

use App\Domain\Parking\ValueObjects\ParkingNumber;

test('should create a parking number with a valid value', function () {
    $parkingNumber = new ParkingNumber('P-123');
    expect($parkingNumber->getValue())->toBe('P-123');
});

test('should create a parking number with null value', function () {
    $parkingNumber = new ParkingNumber(null);
    expect($parkingNumber->getValue())->toBeNull();
});

test('should throw exception when parking number is empty', function () {
    expect(fn() => new ParkingNumber(''))->toThrow(InvalidArgumentException::class, 'Parking number cannot be empty when provided.');
});

test('should throw exception when parking number exceeds 50 characters', function () {
    $longParkingNumber = str_repeat('A', 51);
    expect(fn() => new ParkingNumber($longParkingNumber))->toThrow(InvalidArgumentException::class, 'Parking number cannot exceed 50 characters.');
});

test('should convert to string correctly', function () {
    $parkingNumber = new ParkingNumber('P-123');
    expect((string)$parkingNumber)->toBe('P-123');
    
    $nullParkingNumber = new ParkingNumber(null);
    expect((string)$nullParkingNumber)->toBe('');
});

test('should compare parking numbers correctly', function () {
    $parkingNumber1 = new ParkingNumber('P-123');
    $parkingNumber2 = new ParkingNumber('P-123');
    $parkingNumber3 = new ParkingNumber('P-456');
    $nullParkingNumber = new ParkingNumber(null);
    
    expect($parkingNumber1->equals($parkingNumber2))->toBeTrue();
    expect($parkingNumber1->equals($parkingNumber3))->toBeFalse();
    expect($parkingNumber1->equals($nullParkingNumber))->toBeFalse();
    expect($nullParkingNumber->equals(null))->toBeTrue();
});
