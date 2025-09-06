<?php

namespace App\Application\Vehicle\UseCases;

use App\Application\Vehicle\DTOs\CreateVehicleDTO;
use App\Domain\Vehicle\Entities\Vehicle;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Domain\Vehicle\ValueObjects\Vin;

final class CreateVehicleUseCase
{
    public function __construct(
        private readonly VehicleRepositoryInterface $repository,
    ) {}

    public function execute(CreateVehicleDTO $dto): Vehicle
    {
        if ($this->repository->findByVin(new Vin($dto->vin))) {
            throw new \RuntimeException('Vehicle with this VIN already exists');
        }

        $vehicle = new Vehicle(
            vehicleId: null,
            vin: $dto->getVinVO(),
            make: $dto->make,
            model: $dto->model,
            year: $dto->year,
            ownerName: $dto->ownerName,
            color: $dto->color,
            type: $dto->type,
            weight: $dto->weight,
            vehicleCondition: $dto->vehicleCondition,
            vehicleObservation: $dto->vehicleObservation,
            originCountry: $dto->originCountry,
            shipLocation: $dto->shipLocation,
            isPrimed: $dto->isPrimed,
        );

        return $this->repository->save($vehicle);
    }
}
