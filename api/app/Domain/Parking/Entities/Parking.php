<?php

namespace App\Domain\Parking\Entities;

use App\Domain\Parking\ValueObjects\Capacity;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\ParkingNumber;
use Carbon\Carbon;

final class Parking
{
    public function __construct(
        private readonly ?ParkingId $parkingId,
        private readonly ParkingName $parkingName,
        private readonly Location $location,
        private readonly Capacity $capacity,
        private readonly ?ParkingNumber $parkingNumber = null,
    private readonly ?float $latitude = null,
    private readonly ?float $longitude = null,
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

    public function getParkingNumber(): ?ParkingNumber
    {
        return $this->parkingNumber;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
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
            'parking_number' => $this->parkingNumber?->getValue(),
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
