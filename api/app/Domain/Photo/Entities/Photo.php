<?php

namespace App\Domain\Photo\Entities;

use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Photo\ValueObjects\PhotoId;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use Carbon\Carbon;

final class Photo
{
    public function __construct(
        private readonly ?PhotoId $photoId,
        private readonly string $photoPath,
        private readonly Carbon $takenAt,
        private readonly ?string $photoDescription,
        private readonly DischargeId $dischargeId,
        private readonly ?SurveyId $surveyId,
        private readonly ?SurveyCheckpointId $checkpointId,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getPhotoId(): ?PhotoId
    {
        return $this->photoId;
    }

    public function getPhotoPath(): string
    {
        return $this->photoPath;
    }

    public function getTakenAt(): Carbon
    {
        return $this->takenAt;
    }

    public function getPhotoDescription(): ?string
    {
        return $this->photoDescription;
    }

    public function getDischargeId(): DischargeId
    {
        return $this->dischargeId;
    }

    public function getSurveyId(): ?SurveyId
    {
        return $this->surveyId;
    }

    public function getCheckpointId(): ?SurveyCheckpointId
    {
        return $this->checkpointId;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    public function toArray(): array
    {
        return [
            'photo_id' => $this->photoId?->getValue(),
            'photo_path' => $this->photoPath,
            'taken_at' => $this->takenAt->toISOString(),
            'photo_description' => $this->photoDescription,
            'discharge_id' => $this->dischargeId->getValue(),
            'survey_id' => $this->surveyId?->getValue(),
            'checkpoint_id' => $this->checkpointId?->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
