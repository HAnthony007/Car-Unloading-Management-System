<?php

namespace App\Application\Vehicle\DTOs;

use App\Domain\Vehicle\ValueObjects\Vin;

final class CreateVehicleDTO
{
    public function __construct(
        public readonly string $vin,
        public readonly string $make,
        public readonly string $model,
        public readonly ?string $color,
        public readonly string $type,
        public readonly string $weight,
        public readonly string $vehicleCondition,
        public readonly ?string $vehicleObservation,
        public readonly string $originCountry,
        public readonly ?string $shipLocation,
        public readonly bool $isPrimed,
        public readonly int $dischargeId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            vin: $data['vin'] ?? '',
            make: $data['make'] ?? '',
            model: $data['model'] ?? '',
            color: $data['color'] ?? null,
            type: $data['type'] ?? '',
            weight: $data['weight'] ?? '',
            vehicleCondition: $data['vehicle_condition'] ?? '',
            vehicleObservation: $data['vehicle_observation'] ?? null,
            originCountry: $data['origin_country'] ?? '',
            shipLocation: $data['ship_location'] ?? null,
            isPrimed: (bool)($data['is_primed'] ?? false),
            dischargeId: (int)($data['discharge_id'] ?? 0),
        );
    }

    public function getVinVO(): Vin { return new Vin($this->vin); }
}
