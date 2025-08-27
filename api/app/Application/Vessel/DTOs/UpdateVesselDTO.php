<?php

namespace App\Application\Vessel\DTOs;

final class UpdateVesselDTO
{
    public function __construct(
        public readonly int $vesselId,
        public readonly ?string $imoNo = null,
        public readonly ?string $vesselName = null,
        public readonly ?string $flag = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            vesselId: (int)($data['vessel_id'] ?? 0),
            imoNo: $data['imo_no'] ?? null,
            vesselName: $data['vessel_name'] ?? null,
            flag: $data['flag'] ?? null,
        );
    }

    public function toArray(): array
    {
        $data = [];
        if ($this->imoNo !== null) $data['imo_no'] = $this->imoNo;
        if ($this->vesselName !== null) $data['vessel_name'] = $this->vesselName;
        if ($this->flag !== null) $data['flag'] = $this->flag;
        return $data;
    }
}
