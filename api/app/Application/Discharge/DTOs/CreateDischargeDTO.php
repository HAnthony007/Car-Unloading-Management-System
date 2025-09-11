<?php

namespace App\Application\Discharge\DTOs;

final class CreateDischargeDTO
{
    public function __construct(
        public readonly string $dischargeDate,
        public readonly int $portCallId,
    public readonly int $vehicleId,
    public readonly int $agentId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dischargeDate: (string) ($data['discharge_date'] ?? ''),
            portCallId: (int) ($data['port_call_id'] ?? 0),
            vehicleId: (int) ($data['vehicle_id'] ?? 0),
            agentId: (int) ($data['agent_id'] ?? 0),
        );
    }
}
