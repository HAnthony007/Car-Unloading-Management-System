<?php

namespace App\Application\Vehicle\UseCases;

use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Domain\Vehicle\ValueObjects\VehicleId;

final class DeleteVehicleUseCase
{
    public function __construct(private readonly VehicleRepositoryInterface $repository) {}

    public function execute(int $id): void
    {
        $deleted = $this->repository->delete(new VehicleId($id));
        if (!$deleted) {
            throw new \RuntimeException('Vehicle not found.');
        }
    }
}
