<?php

namespace App\Application\SurveyCheckpoint\DTOs;

use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointComment;
use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointTitle;

final class CreateSurveyCheckpointDTO
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $comment,
        public readonly int $surveyId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            title: $data['title'] ?? '',
            comment: $data['comment'] ?? null,
            surveyId: (int) ($data['survey_id'] ?? 0),
        );
    }

    public function getTitleVO(): CheckpointTitle
    {
        return new CheckpointTitle($this->title);
    }

    public function getCommentVOOrNull(): ?CheckpointComment
    {
        return $this->comment !== null ? new CheckpointComment($this->comment) : null;
    }
}
