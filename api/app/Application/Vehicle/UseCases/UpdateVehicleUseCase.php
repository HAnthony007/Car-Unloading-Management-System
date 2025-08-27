<?php

namespace App\Application\Vehicle\UseCases;

use App\Application\Vehicle\DTOs\UpdateVehicleDTO;
use App\Domain\Vehicle\Entities\Vehicle as DomainVehicle;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use App\Domain\Vehicle\ValueObjects\Vin;

final class UpdateVehicleUseCase
{
    public function __construct(private readonly VehicleRepositoryInterface $repository) {}

    public function execute(UpdateVehicleDTO $dto): DomainVehicle
    {
        $existing = $this->repository->findById(new VehicleId($dto->vehicleId));
        if (! $existing) {
            throw new \RuntimeException('Vehicle not found.');
        }

        // Rebuild entity with updated fields (VIN and discharge not updatable here)
        $updated = new DomainVehicle(
            vehicleId: $existing->getVehicleId(),
            vin: $existing->getVin(),
            make: $dto->make ?? $existing->getMake(),
            model: $dto->model ?? $existing->getModel(),
            color: $dto->color ?? $existing->getColor(),
            type: $dto->type ?? $existing->getType(),
            weight: $dto->weight ?? $existing->getWeight(),
            vehicleCondition: $dto->vehicleCondition ?? $existing->getVehicleCondition(),
            vehicleObservation: $dto->vehicleObservation ?? $existing->getVehicleObservation(),
            originCountry: $dto->originCountry ?? $existing->getOriginCountry(),
            shipLocation: $dto->shipLocation ?? $existing->getShipLocation(),
            isPrimed: $dto->isPrimed ?? $existing->isPrimed(),
            dischargeId: $existing->getDischargeId(),
            createdAt: $existing->getCreatedAt(),
            updatedAt: $existing->getUpdatedAt(),
        );

        return $this->repository->save($updated);
    }
}
