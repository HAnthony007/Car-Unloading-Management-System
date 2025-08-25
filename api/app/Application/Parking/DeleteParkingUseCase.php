<?php

namespace App\Application\Parking;

use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;

final class DeleteParkingUseCase
{
    public function __construct(
        private readonly ParkingRepositoryInterface $parkingRepository
    ) {}

    public function execute(int $parkingId): bool
    {
        $parking = $this->parkingRepository->findById(new ParkingId($parkingId));

        if (!$parking) {
            throw new \Exception("Parking not found with ID: {$parkingId}");
        }

        return $this->parkingRepository->delete(new ParkingId($parkingId));
    }
}
