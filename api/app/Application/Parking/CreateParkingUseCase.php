<?php

namespace App\Application\Parking;

use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;

final class CreateParkingUseCase
{
    public function __construct(
        private readonly ParkingRepositoryInterface $parkingRepository
    ) {}

    public function execute(CreateParkingDTO $dto): Parking
    {
        $parking = new Parking(
            parkingId: null,
            parkingName: $dto->parkingName,
            location: $dto->location,
            capacity: $dto->capacity
        );

        return $this->parkingRepository->save($parking);
    }
}
