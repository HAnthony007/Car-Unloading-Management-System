<?php

namespace App\Application\Vehicle\UseCases;

use App\Domain\Vehicle\Entities\Vehicle;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Domain\Vehicle\ValueObjects\VehicleId;

final class GetVehicleUseCase
{
    public function __construct(private readonly VehicleRepositoryInterface $repository) {}

    public function execute(int $id): Vehicle
    {
        $vehicle = $this->repository->findById(new VehicleId($id));
        if (! $vehicle) {
            throw new \RuntimeException('Vehicle not found.');
        }

        return $vehicle;
    }
}
