<?php

namespace App\Application\Inspection\DTOs;

use Illuminate\Http\UploadedFile;

final class AddCheckpointPhotoDTO
{
    public function __construct(
        public readonly int $checkpointId,
        public readonly UploadedFile $photoFile,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            checkpointId: (int) ($data['checkpoint_id'] ?? 0),
            photoFile: $data['photo_file'],
        );
    }
}
