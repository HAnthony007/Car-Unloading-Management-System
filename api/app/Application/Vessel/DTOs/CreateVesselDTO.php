<?php

namespace App\Application\Vessel\DTOs;

final class CreateVesselDTO
{
    public function __construct(
        public readonly string $imoNo,
        public readonly string $vesselName,
        public readonly string $flag,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            imoNo: $data['imo_no'] ?? '',
            vesselName: $data['vessel_name'] ?? '',
            flag: $data['flag'] ?? '',
        );
    }

    public function toArray(): array
    {
        return [
            'imo_no' => $this->imoNo,
            'vessel_name' => $this->vesselName,
            'flag' => $this->flag,
        ];
    }
}
