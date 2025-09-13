<?php

namespace App\Application\SurveyCheckpoint\DTOs;

use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointComment;
use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointTitle;

final class CreateSurveyCheckpointDTO
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $comment,
        public readonly ?string $description,
        public readonly ?string $result,
        public readonly ?int $order,
        public readonly int $surveyId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            title: $data['title_checkpoint'] ?? $data['title'] ?? '',
            comment: $data['comment_checkpoint'] ?? $data['comment'] ?? null,
            description: $data['description_checkpoint'] ?? null,
            result: $data['result_checkpoint'] ?? null,
            order: isset($data['order_checkpoint']) ? (int) $data['order_checkpoint'] : null,
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
