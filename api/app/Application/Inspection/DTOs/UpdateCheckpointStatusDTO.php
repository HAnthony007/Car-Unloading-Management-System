<?php

namespace App\Application\Inspection\DTOs;

final class UpdateCheckpointStatusDTO
{
    public function __construct(
        public readonly int $checkpointId,
        public readonly string $status,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            checkpointId: (int) ($data['checkpoint_id'] ?? 0),
            status: (string) ($data['status'] ?? ''),
        );
    }
}
