<?php

namespace App\Domain\Parking\Repositories;

use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\ValueObjects\ParkingId;

interface ParkingRepositoryInterface
{
    public function findById(ParkingId $parkingId): ?Parking;

    public function findByName(string $parkingName): ?Parking;

    public function findAll(): array;

    public function save(Parking $parking): Parking;

    public function delete(ParkingId $parkingId): bool;
}
