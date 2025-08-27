<?php

namespace App\Application\Vehicle\UseCases;

use App\Application\Vehicle\DTOs\CreateVehicleDTO;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Vehicle\Entities\Vehicle;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Domain\Vehicle\ValueObjects\Vin;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;

final class CreateVehicleUseCase
{
    public function __construct(
        private readonly VehicleRepositoryInterface $repository,
        private readonly DischargeRepositoryInterface $dischargeRepository,
    ) {}

    public function execute(CreateVehicleDTO $dto): Vehicle
    {
        if ($this->repository->findByVin(new Vin($dto->vin))) {
            throw new \RuntimeException('Vehicle with this VIN already exists');
        }

        // Ensure discharge exists
        $discharge = $this->dischargeRepository->findById(new DischargeId($dto->dischargeId));
        if (!$discharge) {
            throw new \RuntimeException('Invalid discharge');
        }

        $vehicle = new Vehicle(
            vehicleId: null,
            vin: $dto->getVinVO(),
            make: $dto->make,
            model: $dto->model,
            color: $dto->color,
            type: $dto->type,
            weight: $dto->weight,
            vehicleCondition: $dto->vehicleCondition,
            vehicleObservation: $dto->vehicleObservation,
            originCountry: $dto->originCountry,
            shipLocation: $dto->shipLocation,
            isPrimed: $dto->isPrimed,
            dischargeId: new DischargeId($dto->dischargeId),
        );

        return $this->repository->save($vehicle);
    }
}
