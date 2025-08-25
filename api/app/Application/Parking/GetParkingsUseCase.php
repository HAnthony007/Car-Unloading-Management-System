<?php

namespace App\Application\Parking;

use App\Domain\Parking\Repositories\ParkingRepositoryInterface;

final class GetParkingsUseCase
{
    public function __construct(
        private readonly ParkingRepositoryInterface $parkingRepository
    ) {}

    public function execute(): array
    {
        return $this->parkingRepository->findAll();
    }
}
