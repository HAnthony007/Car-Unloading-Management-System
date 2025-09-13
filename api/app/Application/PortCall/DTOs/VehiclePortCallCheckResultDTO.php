<?php

namespace App\Application\PortCall\DTOs;

final class VehiclePortCallCheckResultDTO
{
    public function __construct(
        public readonly string $vin,
        public readonly bool $vehicleExists,
        public readonly ?int $vehicleId,
        public readonly ?int $dischargeId,
    ) {}

    public function toArray(): array
    {
        return [
            'vin' => $this->vin,
            'vehicle_exists' => $this->vehicleExists,
            'vehicle_id' => $this->vehicleId,
            'discharge_id' => $this->dischargeId,
        ];
    }
}
