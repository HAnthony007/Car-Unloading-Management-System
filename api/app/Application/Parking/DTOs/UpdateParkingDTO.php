<?php

namespace App\Application\Parking\DTOs;

final class UpdateParkingDTO
{
    public function __construct(
        public readonly int $parkingId,
        public readonly ?string $parkingName = null,
        public readonly ?string $location = null,
        public readonly ?int $capacity = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            parkingId: (int)($data['parking_id'] ?? 0),
            parkingName: $data['parking_name'] ?? null,
            location: $data['location'] ?? null,
            capacity: isset($data['capacity']) ? (int)$data['capacity'] : null
        );
    }

    public function toArray(): array
    {
        $data = [];
        
        if ($this->parkingName !== null) {
            $data['parking_name'] = $this->parkingName;
        }
        
        if ($this->location !== null) {
            $data['location'] = $this->location;
        }
        
        if ($this->capacity !== null) {
            $data['capacity'] = $this->capacity;
        }
        
        return $data;
    }
}
