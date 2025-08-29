<?php

namespace App\Application\Photo\DTOs;

final class UpdatePhotoDTO
{
    public function __construct(
        public readonly int $photoId,
        public readonly ?string $photoPath,
        public readonly ?string $takenAt,
        public readonly ?string $photoDescription,
        public readonly ?int $followUpFileId,
        public readonly ?int $checkpointId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            photoId: (int) ($data['photo_id'] ?? 0),
            photoPath: $data['photo_path'] ?? null,
            takenAt: $data['taken_at'] ?? null,
            photoDescription: $data['photo_description'] ?? null,
            followUpFileId: isset($data['follow_up_file_id']) ? (int) $data['follow_up_file_id'] : null,
            checkpointId: isset($data['checkpoint_id']) ? (int) $data['checkpoint_id'] : null,
        );
    }
}
