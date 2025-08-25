<?php

describe('Parking DTOs', function () {
    describe('CreateParkingDTO', function () {
        it('creates DTO with correct values', function () {
            $dto = new \App\Application\Parking\CreateParkingDTO(
                parkingName: new \App\Domain\Parking\ValueObjects\ParkingName('Test Parking'),
                location: new \App\Domain\Parking\ValueObjects\Location('Zone A'),
                capacity: new \App\Domain\Parking\ValueObjects\Capacity(100)
            );

            expect($dto->parkingName->getValue())->toBe('Test Parking');
            expect($dto->location->getValue())->toBe('Zone A');
            expect($dto->capacity->getValue())->toBe(100);
        });

        it('creates DTO from array', function () {
            $data = [
                'parking_name' => 'Test Parking',
                'location' => 'Zone A',
                'capacity' => 100
            ];

            $dto = \App\Application\Parking\CreateParkingDTO::fromArray($data);

            expect($dto->parkingName->getValue())->toBe('Test Parking');
            expect($dto->location->getValue())->toBe('Zone A');
            expect($dto->capacity->getValue())->toBe(100);
        });

        it('converts to array correctly', function () {
            $dto = new \App\Application\Parking\CreateParkingDTO(
                parkingName: new \App\Domain\Parking\ValueObjects\ParkingName('Test Parking'),
                location: new \App\Domain\Parking\ValueObjects\Location('Zone A'),
                capacity: new \App\Domain\Parking\ValueObjects\Capacity(100)
            );

            $array = $dto->toArray();

            expect($array)->toBe([
                'parking_name' => 'Test Parking',
                'location' => 'Zone A',
                'capacity' => 100,
            ]);
        });
    });

    describe('UpdateParkingDTO', function () {
        it('creates DTO with correct values', function () {
            $dto = new \App\Application\Parking\UpdateParkingDTO(
                parkingName: new \App\Domain\Parking\ValueObjects\ParkingName('Updated Parking'),
                location: new \App\Domain\Parking\ValueObjects\Location('Zone B'),
                capacity: new \App\Domain\Parking\ValueObjects\Capacity(150)
            );

            expect($dto->parkingName->getValue())->toBe('Updated Parking');
            expect($dto->location->getValue())->toBe('Zone B');
            expect($dto->capacity->getValue())->toBe(150);
        });

        it('creates DTO from array', function () {
            $data = [
                'parking_name' => 'Updated Parking',
                'location' => 'Zone B',
                'capacity' => 150
            ];

            $dto = \App\Application\Parking\UpdateParkingDTO::fromArray($data);

            expect($dto->parkingName->getValue())->toBe('Updated Parking');
            expect($dto->location->getValue())->toBe('Zone B');
            expect($dto->capacity->getValue())->toBe(150);
        });

        it('handles partial updates', function () {
            $data = [
                'parking_name' => 'Updated Parking'
            ];

            $dto = \App\Application\Parking\UpdateParkingDTO::fromArray($data);

            expect($dto->parkingName->getValue())->toBe('Updated Parking');
            expect($dto->location)->toBeNull();
            expect($dto->capacity)->toBeNull();
        });

        it('converts to array correctly for partial updates', function () {
            $dto = new \App\Application\Parking\UpdateParkingDTO(
                parkingName: new \App\Domain\Parking\ValueObjects\ParkingName('Updated Parking'),
                location: null,
                capacity: null
            );

            $array = $dto->toArray();

            expect($array)->toBe([
                'parking_name' => 'Updated Parking',
            ]);
        });
    });
});

describe('Parking ValueObjects', function () {
    describe('ParkingName', function () {
        it('creates valid parking name', function () {
            $name = new \App\Domain\Parking\ValueObjects\ParkingName('Valid Name');
            expect($name->getValue())->toBe('Valid Name');
        });

        it('throws exception for empty name', function () {
            expect(fn() => new \App\Domain\Parking\ValueObjects\ParkingName(''))
                ->toThrow(\InvalidArgumentException::class);
        });

        it('throws exception for too long name', function () {
            $longName = str_repeat('a', 101);
            expect(fn() => new \App\Domain\Parking\ValueObjects\ParkingName($longName))
                ->toThrow(\InvalidArgumentException::class);
        });
    });

    describe('Location', function () {
        it('creates valid location', function () {
            $location = new \App\Domain\Parking\ValueObjects\Location('Zone A');
            expect($location->getValue())->toBe('Zone A');
        });

        it('throws exception for empty location', function () {
            expect(fn() => new \App\Domain\Parking\ValueObjects\Location(''))
                ->toThrow(\InvalidArgumentException::class);
        });
    });

    describe('Capacity', function () {
        it('creates valid capacity', function () {
            $capacity = new \App\Domain\Parking\ValueObjects\Capacity(100);
            expect($capacity->getValue())->toBe(100);
        });

        it('throws exception for negative capacity', function () {
            expect(fn() => new \App\Domain\Parking\ValueObjects\Capacity(-1))
                ->toThrow(\InvalidArgumentException::class);
        });

        it('throws exception for too large capacity', function () {
            expect(fn() => new \App\Domain\Parking\ValueObjects\Capacity(10001))
                ->toThrow(\InvalidArgumentException::class);
        });
    });
});
