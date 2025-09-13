<?php

namespace App\Application\Discharge\DTOs;

final class UpdateDischargeDTO
{
    public function __construct(
        public readonly int $dischargeId,
        public readonly ?string $dischargeDate = null,
        public readonly ?int $portCallId = null,
        public readonly ?int $vehicleId = null,
        public readonly ?int $agentId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dischargeId: (int) ($data['discharge_id'] ?? 0),
            dischargeDate: $data['discharge_date'] ?? null,
            portCallId: isset($data['port_call_id']) ? (int) $data['port_call_id'] : null,
            vehicleId: isset($data['vehicle_id']) ? (int) $data['vehicle_id'] : null,
            agentId: isset($data['agent_id']) ? (int) $data['agent_id'] : null,
        );
    }
}
