<?php

namespace App\Application\Parking\DTOs;

final class CreateParkingDTO
{
    public function __construct(
        public readonly string $parkingName,
        public readonly string $location,
        public readonly int $capacity,
        public readonly ?string $parkingNumber = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            parkingName: $data['parking_name'] ?? '',
            location: $data['location'] ?? '',
            capacity: (int)($data['capacity'] ?? 0),
            parkingNumber: $data['parking_number'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'parking_name' => $this->parkingName,
            'location' => $this->location,
            'capacity' => $this->capacity,
            'parking_number' => $this->parkingNumber,
        ];
    }
}
