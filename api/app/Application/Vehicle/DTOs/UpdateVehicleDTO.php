<?php

namespace App\Application\Vehicle\DTOs;

final class UpdateVehicleDTO
{
    public function __construct(
        public readonly int $vehicleId,
        public readonly ?string $make = null,
        public readonly ?string $model = null,
        public readonly ?string $color = null,
        public readonly ?string $type = null,
        public readonly ?string $weight = null,
        public readonly ?string $vehicleCondition = null,
        public readonly ?string $vehicleObservation = null,
        public readonly ?string $originCountry = null,
        public readonly ?string $shipLocation = null,
        public readonly ?bool $isPrimed = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            vehicleId: (int)$data['vehicle_id'],
            make: $data['make'] ?? null,
            model: $data['model'] ?? null,
            color: $data['color'] ?? null,
            type: $data['type'] ?? null,
            weight: $data['weight'] ?? null,
            vehicleCondition: $data['vehicle_condition'] ?? null,
            vehicleObservation: $data['vehicle_observation'] ?? null,
            originCountry: $data['origin_country'] ?? null,
            shipLocation: $data['ship_location'] ?? null,
            isPrimed: isset($data['is_primed']) ? (bool)$data['is_primed'] : null,
        );
    }
}
