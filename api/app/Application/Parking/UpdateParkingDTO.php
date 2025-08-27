<?php

namespace App\Application\Parking;

use App\Domain\Parking\ValueObjects\Capacity;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\ParkingName;

final class UpdateParkingDTO
{
    public function __construct(
        public readonly ?ParkingName $parkingName = null,
        public readonly ?Location $location = null,
        public readonly ?Capacity $capacity = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            parkingName: isset($data['parking_name']) ? new ParkingName($data['parking_name']) : null,
            location: isset($data['location']) ? new Location($data['location']) : null,
            capacity: isset($data['capacity']) ? new Capacity($data['capacity']) : null
        );
    }

    public function toArray(): array
    {
        $result = [];

        if ($this->parkingName !== null) {
            $result['parking_name'] = $this->parkingName->getValue();
        }

        if ($this->location !== null) {
            $result['location'] = $this->location->getValue();
        }

        if ($this->capacity !== null) {
            $result['capacity'] = $this->capacity->getValue();
        }

        return $result;
    }
}
