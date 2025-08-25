<?php

namespace App\Domain\Parking\Entities;

use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\Capacity;
use Carbon\Carbon;

final class Parking
{
    public function __construct(
        private readonly ?ParkingId $parkingId,
        private readonly ParkingName $parkingName,
        private readonly Location $location,
        private readonly Capacity $capacity,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null
    ) {}

    public function getParkingId(): ?ParkingId
    {
        return $this->parkingId;
    }

    public function getParkingName(): ParkingName
    {
        return $this->parkingName;
    }

    public function getLocation(): Location
    {
        return $this->location;
    }

    public function getCapacity(): Capacity
    {
        return $this->capacity;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    public function toArray(): array
    {
        return [
            'parking_id' => $this->parkingId?->getValue(),
            'parking_name' => $this->parkingName->getValue(),
            'location' => $this->location->getValue(),
            'capacity' => $this->capacity->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
