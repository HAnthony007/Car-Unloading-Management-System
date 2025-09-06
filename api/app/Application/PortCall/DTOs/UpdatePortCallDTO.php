<?php

namespace App\Application\PortCall\DTOs;

final class UpdatePortCallDTO
{
    public function __construct(
        public readonly int $portCallId,
        public readonly ?string $vesselAgent = null,
        public readonly ?string $originPort = null,
        public readonly ?string $estimatedArrival = null,
        public readonly ?string $arrivalDate = null,
        public readonly ?string $estimatedDeparture = null,
        public readonly ?string $departureDate = null,
        public readonly ?int $vesselId = null,
        public readonly ?int $dockId = null,
        public readonly ?string $status = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            portCallId: (int) ($data['port_call_id'] ?? 0),
            vesselAgent: $data['vessel_agent'] ?? null,
            originPort: $data['origin_port'] ?? null,
            estimatedArrival: $data['estimated_arrival'] ?? null,
            arrivalDate: $data['arrival_date'] ?? null,
            estimatedDeparture: $data['estimated_departure'] ?? null,
            departureDate: $data['departure_date'] ?? null,
            vesselId: isset($data['vessel_id']) ? (int) $data['vessel_id'] : null,
            dockId: isset($data['dock_id']) ? (int) $data['dock_id'] : null,
            status: $data['status'] ?? null,
        );
    }
}
