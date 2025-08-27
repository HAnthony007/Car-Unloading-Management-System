<?php

namespace App\Application\Parking\UseCases;

use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;

final class DeleteParkingUseCase
{
    public function __construct(private readonly ParkingRepositoryInterface $parkingRepository) {}

    public function execute(int $parkingId): void
    {
        $parkingIdValueObject = new ParkingId($parkingId);
        $success = $this->parkingRepository->delete($parkingIdValueObject);

        if (! $success) {
            throw new \RuntimeException('Parking not found');
        }
    }
}
