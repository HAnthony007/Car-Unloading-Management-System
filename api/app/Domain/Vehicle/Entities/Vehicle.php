<?php

namespace App\Domain\Vehicle\Entities;

use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use App\Domain\Vehicle\ValueObjects\Vin;
use Carbon\Carbon;

final class Vehicle
{
    public function __construct(
        private readonly ?VehicleId $vehicleId,
        private readonly Vin $vin,
        private readonly string $make,
        private readonly string $model,
        private readonly ?string $color,
        private readonly string $type,
        private readonly string $weight,
        private readonly string $vehicleCondition,
        private readonly ?string $vehicleObservation,
        private readonly string $originCountry,
        private readonly ?string $shipLocation,
        private readonly bool $isPrimed,
        private readonly DischargeId $dischargeId,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getVehicleId(): ?VehicleId { return $this->vehicleId; }
    public function getVin(): Vin { return $this->vin; }
    public function getMake(): string { return $this->make; }
    public function getModel(): string { return $this->model; }
    public function getColor(): ?string { return $this->color; }
    public function getType(): string { return $this->type; }
    public function getWeight(): string { return $this->weight; }
    public function getVehicleCondition(): string { return $this->vehicleCondition; }
    public function getVehicleObservation(): ?string { return $this->vehicleObservation; }
    public function getOriginCountry(): string { return $this->originCountry; }
    public function getShipLocation(): ?string { return $this->shipLocation; }
    public function isPrimed(): bool { return $this->isPrimed; }
    public function getDischargeId(): DischargeId { return $this->dischargeId; }
    public function getCreatedAt(): ?Carbon { return $this->createdAt; }
    public function getUpdatedAt(): ?Carbon { return $this->updatedAt; }

    public function toArray(): array
    {
        return [
            'vehicle_id' => $this->vehicleId?->getValue(),
            'vin' => $this->vin->getValue(),
            'make' => $this->make,
            'model' => $this->model,
            'color' => $this->color,
            'type' => $this->type,
            'weight' => $this->weight,
            'vehicle_condition' => $this->vehicleCondition,
            'vehicle_observation' => $this->vehicleObservation,
            'origin_country' => $this->originCountry,
            'ship_location' => $this->shipLocation,
            'is_primed' => $this->isPrimed,
            'discharge_id' => $this->dischargeId->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
