<?php

namespace App\Application\Parking\UseCases;

use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;

final class GetParkingsUseCase
{
    public function __construct(private readonly ParkingRepositoryInterface $parkingRepository) {}

    /**
     * @return array<int, Parking>
     */
    public function execute(): array
    {
        return $this->parkingRepository->findAll();
    }
}
