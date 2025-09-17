<?php

namespace App\Application\Parking\UseCases;

use App\Application\Parking\DTOs\CreateParkingDTO;
use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\Capacity;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\ParkingNumber;

final class CreateParkingUseCase
{
    public function __construct(private readonly ParkingRepositoryInterface $parkingRepository) {}

    public function execute(CreateParkingDTO $dto): Parking
    {
        // Vérification supplémentaire pour Mahasarika parking
        if ($dto->parkingName === 'Mahasarika' && empty($dto->parkingNumber)) {
            throw new \InvalidArgumentException('Parking number is required for Mahasarika parking.');
        }

        $parking = new Parking(
            parkingId: null,
            parkingName: new ParkingName($dto->parkingName),
            location: new Location($dto->location),
            capacity: new Capacity($dto->capacity),
                parkingNumber: $dto->parkingNumber !== null ? new ParkingNumber($dto->parkingNumber) : null,
                latitude: $dto->latitude,
                longitude: $dto->longitude,
        );

        return $this->parkingRepository->save($parking);
    }
}
