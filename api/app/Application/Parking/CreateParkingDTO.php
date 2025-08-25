<?php

namespace App\Application\Parking;

use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\Capacity;

final class CreateParkingDTO
{
    public function __construct(
        public readonly ParkingName $parkingName,
        public readonly Location $location,
        public readonly Capacity $capacity
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            parkingName: new ParkingName($data['parking_name']),
            location: new Location($data['location']),
            capacity: new Capacity($data['capacity'])
        );
    }

    public function toArray(): array
    {
        return [
            'parking_name' => $this->parkingName->getValue(),
            'location' => $this->location->getValue(),
            'capacity' => $this->capacity->getValue(),
        ];
    }
}
