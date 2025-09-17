<?php

namespace App\Application\Inspection\DTOs;

final class ConfirmInspectionDTO
{
    public function __construct(
        public readonly int $inspectionId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            inspectionId: (int) ($data['inspection_id'] ?? 0),
        );
    }
}
