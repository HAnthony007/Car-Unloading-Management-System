<?php

namespace App\Application\PortCall\DTOs;

final class CreatePortCallDTO
{
    public function __construct(
        public readonly string $vesselAgent,
        public readonly string $originPort,
        public readonly ?string $estimatedArrival,
        public readonly string $arrivalDate,
        public readonly ?string $estimatedDeparture,
    public readonly ?string $departureDate,
        public readonly int $vesselId,
        public readonly int $dockId,
    public readonly string $status = 'pending',
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            vesselAgent: (string) ($data['vessel_agent'] ?? ''),
            originPort: (string) ($data['origin_port'] ?? ''),
            estimatedArrival: $data['estimated_arrival'] ?? null,
            arrivalDate: (string) ($data['arrival_date'] ?? ''),
            estimatedDeparture: $data['estimated_departure'] ?? null,
            departureDate: $data['departure_date'] ?? null,
            vesselId: (int) ($data['vessel_id'] ?? 0),
            dockId: (int) ($data['dock_id'] ?? 0),
            status: $data['status'] ?? 'pending',
        );
    }
}
