<?php

namespace App\Application\Inspection\DTOs;

final class UpdateCheckpointCommentDTO
{
    public function __construct(
        public readonly int $checkpointId,
        public readonly string $comment,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            checkpointId: (int) ($data['checkpoint_id'] ?? 0),
            comment: (string) ($data['comment'] ?? ''),
        );
    }
}
