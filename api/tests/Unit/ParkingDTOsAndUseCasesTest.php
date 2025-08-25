<?php

use App\Application\Parking\DTOs\CreateParkingDTO;
use App\Application\Parking\DTOs\UpdateParkingDTO;

describe('Parking DTOs', function () {
    describe('CreateParkingDTO', function () {
        it('creates DTO with correct values', function () {
            $dto = new CreateParkingDTO(
                parkingName: 'Test Parking',
                location: 'Zone A',
                capacity: 50
            );

            expect($dto->parkingName)->toBe('Test Parking');
            expect($dto->location)->toBe('Zone A');
            expect($dto->capacity)->toBe(50);
        });

        it('creates DTO from array', function () {
            $data = [
                'parking_name' => 'Test Parking',
                'location' => 'Zone A',
                'capacity' => 50,
            ];

            $dto = CreateParkingDTO::fromArray($data);

            expect($dto->parkingName)->toBe('Test Parking');
            expect($dto->location)->toBe('Zone A');
            expect($dto->capacity)->toBe(50);
        });

        it('converts to array correctly', function () {
            $dto = new CreateParkingDTO(
                parkingName: 'Test Parking',
                location: 'Zone A',
                capacity: 50
            );

            $array = $dto->toArray();

            expect($array)->toBe([
                'parking_name' => 'Test Parking',
                'location' => 'Zone A',
                'capacity' => 50,
            ]);
        });
    });

    describe('UpdateParkingDTO', function () {
        it('creates DTO with correct values', function () {
            $dto = new UpdateParkingDTO(
                parkingId: 1,
                parkingName: 'Updated Parking',
                location: 'Zone B',
                capacity: 75
            );

            expect($dto->parkingId)->toBe(1);
            expect($dto->parkingName)->toBe('Updated Parking');
            expect($dto->location)->toBe('Zone B');
            expect($dto->capacity)->toBe(75);
        });

        it('creates DTO from array', function () {
            $data = [
                'parking_id' => 1,
                'parking_name' => 'Updated Parking',
                'location' => 'Zone B',
                'capacity' => 75,
            ];

            $dto = UpdateParkingDTO::fromArray($data);

            expect($dto->parkingId)->toBe(1);
            expect($dto->parkingName)->toBe('Updated Parking');
            expect($dto->location)->toBe('Zone B');
            expect($dto->capacity)->toBe(75);
        });

        it('handles partial updates', function () {
            $data = [
                'parking_id' => 1,
                'parking_name' => 'Updated Parking',
            ];

            $dto = UpdateParkingDTO::fromArray($data);

            expect($dto->parkingId)->toBe(1);
            expect($dto->parkingName)->toBe('Updated Parking');
            expect($dto->location)->toBeNull();
            expect($dto->capacity)->toBeNull();
        });

        it('converts to array correctly for partial updates', function () {
            $dto = new UpdateParkingDTO(
                parkingId: 1,
                parkingName: 'Updated Parking'
            );

            $array = $dto->toArray();

            expect($array)->toBe([
                'parking_name' => 'Updated Parking',
            ]);
        });
    });
});
