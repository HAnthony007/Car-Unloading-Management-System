<?php

namespace App\Application\Vehicle\UseCases;

use App\Domain\Vehicle\Entities\Vehicle;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;

final class GetVehiclesUseCase
{
    public function __construct(private readonly VehicleRepositoryInterface $repository) {}

    /** @return array<int, Vehicle> */
    public function execute(): array
    {
        return $this->repository->findAll();
    }
}
