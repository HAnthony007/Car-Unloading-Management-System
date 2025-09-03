<?php

namespace App\Domain\Vehicle\Repositories;

use App\Domain\Vehicle\Entities\Vehicle;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use App\Domain\Vehicle\ValueObjects\Vin;

interface VehicleRepositoryInterface
{
    public function findById(VehicleId $vehicleId): ?Vehicle;

    public function findByVin(Vin $vin): ?Vehicle;

    /** @return array<int, Vehicle> */
    public function findAll(): array;

    public function save(Vehicle $vehicle): Vehicle;

    public function delete(VehicleId $vehicleId): bool;

    /**
     * @return array{data: array<int, Vehicle>, current_page: int, from: int, last_page: int, path: string, per_page: int, to: int, total: int}
     */
    public function search(?string $vin, ?int $dischargeId, ?string $make, ?string $model, ?string $ownerName, ?string $color, ?string $type, ?string $originCountry, ?string $searchTerm, int $page, int $perPage): array;
}
