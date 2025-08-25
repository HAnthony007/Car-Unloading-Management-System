<?php

namespace App\Application\Parking;

use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;

final class GetParkingUseCase
{
    public function __construct(
        private readonly ParkingRepositoryInterface $parkingRepository
    ) {}

    public function execute(int $parkingId): Parking
    {
        $parking = $this->parkingRepository->findById(new ParkingId($parkingId));

        if (!$parking) {
            throw new \Exception("Parking not found with ID: {$parkingId}");
        }

        return $parking;
    }
}
