<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\Capacity;
use App\Domain\Parking\ValueObjects\ParkingNumber;
use App\Models\Parking as EloquentParking;

final class EloquentParkingRepository implements ParkingRepositoryInterface
{
    public function findById(ParkingId $parkingId): ?Parking
    {
        $eloquentParking = EloquentParking::find($parkingId->getValue());

        return $eloquentParking ? $this->toDomainEntity($eloquentParking) : null;
    }

    public function findAll(): array
    {
        $eloquentParkings = EloquentParking::all();

        return $eloquentParkings->map(function ($eloquentParking) {
            return $this->toDomainEntity($eloquentParking);
        })->toArray();
    }

    public function save(Parking $parking): Parking
    {
        $eloquentParking = $parking->getParkingId() 
            ? EloquentParking::find($parking->getParkingId()->getValue())
            : new EloquentParking();

        if (!$eloquentParking) {
            $eloquentParking = new EloquentParking();
        }

        $eloquentParking->parking_name = $parking->getParkingName()->getValue();
        $eloquentParking->location = $parking->getLocation()->getValue();
        $eloquentParking->capacity = $parking->getCapacity()->getValue();
        $eloquentParking->parking_number = $parking->getParkingNumber()?->getValue();

        $eloquentParking->save();

        return $this->toDomainEntity($eloquentParking);
    }

    public function delete(ParkingId $parkingId): bool
    {
        $eloquentParking = EloquentParking::find($parkingId->getValue());

        if (!$eloquentParking) {
            return false;
        }

        return $eloquentParking->delete();
    }

    private function toDomainEntity(EloquentParking $eloquentParking): Parking
    {
        return new Parking(
            parkingId: new ParkingId($eloquentParking->parking_id),
            parkingName: new ParkingName($eloquentParking->parking_name),
            location: new Location($eloquentParking->location),
            capacity: new Capacity($eloquentParking->capacity),
            parkingNumber: $eloquentParking->parking_number !== null ? new ParkingNumber($eloquentParking->parking_number) : null,
            createdAt: $eloquentParking->created_at,
            updatedAt: $eloquentParking->updated_at
        );
    }
}
