<?php

namespace App\Application\Vehicle\UseCases;

use App\Application\Vehicle\DTOs\VehicleSearchCriteriaDTO;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;

final class SearchVehiclesUseCase
{
    public function __construct(private readonly VehicleRepositoryInterface $repository) {}

    public function execute(VehicleSearchCriteriaDTO $criteria): array
    {
        return $this->repository->search(
            vin: $criteria->vin,
            dischargeId: $criteria->dischargeId,
            make: $criteria->make,
            model: $criteria->model,
            page: $criteria->page,
            perPage: $criteria->perPage,
        );
    }
}
