<?php

namespace App\Application\Inspection\DTOs;

final class RemoveCheckpointPhotoDTO
{
    public function __construct(
        public readonly int $checkpointId,
        public readonly int $photoIndex,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            checkpointId: (int) ($data['checkpoint_id'] ?? 0),
            photoIndex: (int) ($data['photo_index'] ?? 0),
        );
    }
}
