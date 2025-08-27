<?php

namespace App\Domain\SurveyCheckpoint\Entities;

use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointComment;
use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointTitle;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use Carbon\Carbon;

final class SurveyCheckpoint
{
    public function __construct(
        private readonly ?SurveyCheckpointId $checkpointId,
        private readonly CheckpointTitle $title,
        private readonly ?CheckpointComment $comment,
        private readonly SurveyId $surveyId,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getCheckpointId(): ?SurveyCheckpointId
    {
        return $this->checkpointId;
    }

    public function getTitle(): CheckpointTitle
    {
        return $this->title;
    }

    public function getComment(): ?CheckpointComment
    {
        return $this->comment;
    }

    public function getSurveyId(): SurveyId
    {
        return $this->surveyId;
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
            'checkpoint_id' => $this->checkpointId?->getValue(),
            'title' => $this->title->getValue(),
            'comment' => $this->comment?->getValue(),
            'survey_id' => $this->surveyId->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
