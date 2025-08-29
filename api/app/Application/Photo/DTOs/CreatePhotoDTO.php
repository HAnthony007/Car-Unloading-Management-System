<?php

namespace App\Application\Photo\DTOs;

use Carbon\Carbon;

final class CreatePhotoDTO
{
    public function __construct(
        public readonly string $photoPath,
        public readonly string $takenAt,
        public readonly ?string $photoDescription,
        public readonly ?int $followUpFileId,
        public readonly ?int $checkpointId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            photoPath: $data['photo_path'] ?? '',
            takenAt: $data['taken_at'] ?? Carbon::now()->toISOString(),
            photoDescription: $data['photo_description'] ?? null,
            followUpFileId: isset($data['follow_up_file_id']) ? (int) $data['follow_up_file_id'] : null,
            checkpointId: isset($data['checkpoint_id']) ? (int) $data['checkpoint_id'] : null,
        );
    }
}
