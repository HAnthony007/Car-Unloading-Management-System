<?php

namespace App\Application\SurveyCheckpoint\DTOs;

use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointComment;
use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointTitle;

final class UpdateSurveyCheckpointDTO
{
    public function __construct(
        public readonly int $checkpointId,
        public readonly ?string $title = null,
        public readonly ?string $comment = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            checkpointId: (int) $data['checkpoint_id'],
            title: $data['title'] ?? null,
            comment: $data['comment'] ?? null,
        );
    }

    public function getTitleVOOrNull(): ?CheckpointTitle
    {
        return $this->title !== null ? new CheckpointTitle($this->title) : null;
    }

    public function getCommentVOOrNull(): ?CheckpointComment
    {
        return $this->comment !== null ? new CheckpointComment($this->comment) : null;
    }
}
