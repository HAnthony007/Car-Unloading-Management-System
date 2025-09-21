<?php

namespace App\Application\Photo\DTOs;

use Illuminate\Http\UploadedFile;
use Carbon\Carbon;

final class UploadDischargePhotoDTO
{
    public function __construct(
        public readonly int $dischargeId,
        public readonly UploadedFile $file,
        public readonly string $takenAt,
        public readonly ?string $photoDescription,
        public readonly ?int $checkpointId,
        public readonly string $visibility,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dischargeId: (int) $data['discharge_id'],
            file: $data['file'],
            takenAt: $data['taken_at'] ?? Carbon::now()->toISOString(),
            photoDescription: $data['photo_description'] ?? null,
            checkpointId: isset($data['checkpoint_id']) ? (int) $data['checkpoint_id'] : null,
            visibility: $data['visibility'] ?? 'public',
        );
    }
}
