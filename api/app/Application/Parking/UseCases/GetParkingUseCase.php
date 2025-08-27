<?php

namespace App\Application\Parking\UseCases;

use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;

final class GetParkingUseCase
{
    public function __construct(private readonly ParkingRepositoryInterface $parkingRepository) {}

    public function execute(int $parkingId): Parking
    {
        $parkingIdValueObject = new ParkingId($parkingId);
        $parking = $this->parkingRepository->findById($parkingIdValueObject);
        
        if (!$parking) {
            throw new \RuntimeException('Parking not found');
        }
        
        return $parking;
    }
}
