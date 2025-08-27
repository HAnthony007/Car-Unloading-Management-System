<?php

namespace App\Application\Parking;

use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;

final class UpdateParkingUseCase
{
    public function __construct(
        private readonly ParkingRepositoryInterface $parkingRepository
    ) {}

    public function execute(int $parkingId, UpdateParkingDTO $dto): Parking
    {
        $existingParking = $this->parkingRepository->findById(new ParkingId($parkingId));

        if (! $existingParking) {
            throw new \Exception("Parking not found with ID: {$parkingId}");
        }

        $updatedParking = new Parking(
            parkingId: $existingParking->getParkingId(),
            parkingName: $dto->parkingName ?? $existingParking->getParkingName(),
            location: $dto->location ?? $existingParking->getLocation(),
            capacity: $dto->capacity ?? $existingParking->getCapacity(),
            createdAt: $existingParking->getCreatedAt(),
            updatedAt: $existingParking->getUpdatedAt()
        );

        return $this->parkingRepository->save($updatedParking);
    }
}
