<?php

namespace App\Application\Photo\DTOs;

use Carbon\Carbon;

final class CreatePhotoDTO
{
    public function __construct(
        public readonly string $photoPath,
        public readonly string $takenAt,
        public readonly ?string $photoDescription,
        public readonly int $dischargeId,
        public readonly ?int $surveyId,
        public readonly ?int $checkpointId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            photoPath: $data['photo_path'] ?? '',
            takenAt: $data['taken_at'] ?? Carbon::now()->toISOString(),
            photoDescription: $data['photo_description'] ?? null,
            dischargeId: (int) $data['discharge_id'],
            surveyId: isset($data['survey_id']) ? (int) $data['survey_id'] : null,
            checkpointId: isset($data['checkpoint_id']) ? (int) $data['checkpoint_id'] : null,
        );
    }
}
