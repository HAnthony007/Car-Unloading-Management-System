<?php

namespace App\Application\Discharge\DTOs;

final class UpdateDischargeDTO
{
    public function __construct(
        public readonly int $dischargeId,
        public readonly ?string $dischargeDate = null,
        public readonly ?int $portCallId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dischargeId: (int) ($data['discharge_id'] ?? 0),
            dischargeDate: $data['discharge_date'] ?? null,
            portCallId: isset($data['port_call_id']) ? (int) $data['port_call_id'] : null,
        );
    }
}
