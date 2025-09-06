<?php

namespace App\Application\Vehicle\UseCases;

use App\Application\Vehicle\DTOs\VehicleSearchCriteriaDTO;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;

final class SearchVehiclesUseCase
{
    public function __construct(private readonly VehicleRepositoryInterface $repository) {}

    public function execute(VehicleSearchCriteriaDTO $criteria): array
    {
        // Discharge filtering removed after relationship inversion (discharge now owns vehicle_id)
        return $this->repository->search(
            vin: $criteria->vin,
            make: $criteria->make,
            model: $criteria->model,
            ownerName: $criteria->ownerName,
            color: $criteria->color,
            type: $criteria->type,
            originCountry: $criteria->originCountry,
            searchTerm: $criteria->searchTerm,
            page: $criteria->page,
            perPage: $criteria->perPage,
        );
    }
}
