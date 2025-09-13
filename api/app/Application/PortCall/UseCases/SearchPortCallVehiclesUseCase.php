<?php

namespace App\Application\PortCall\UseCases;

use App\Application\Vehicle\DTOs\PortCallVehicleSearchCriteriaDTO;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;

final class SearchPortCallVehiclesUseCase
{
    public function __construct(private readonly VehicleRepositoryInterface $vehicleRepository) {}

    public function execute(PortCallVehicleSearchCriteriaDTO $criteria): array
    {
        return $this->vehicleRepository->searchByPortCall(
            new PortCallId($criteria->portCallId),
            $criteria->vin,
            $criteria->make,
            $criteria->model,
            $criteria->ownerName,
            $criteria->color,
            $criteria->type,
            $criteria->originCountry,
            $criteria->searchTerm,
            $criteria->page,
            $criteria->perPage,
        );
    }
}
