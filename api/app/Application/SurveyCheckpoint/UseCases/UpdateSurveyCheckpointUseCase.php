<?php

namespace App\Application\SurveyCheckpoint\UseCases;

use App\Application\SurveyCheckpoint\DTOs\UpdateSurveyCheckpointDTO;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;

final class UpdateSurveyCheckpointUseCase
{
    public function __construct(private readonly SurveyCheckpointRepositoryInterface $repository) {}

    public function execute(UpdateSurveyCheckpointDTO $dto): \App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint
    {
        $existing = $this->repository->findById(new SurveyCheckpointId($dto->checkpointId));
        if (! $existing) {
            throw new \RuntimeException('SurveyCheckpoint not found.');
        }

        $updated = new \App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint(
            checkpointId: $existing->getCheckpointId(),
            title: $dto->getTitleVOOrNull() ?? $existing->getTitle(),
            comment: $dto->getCommentVOOrNull() ?? $existing->getComment(),
            description: $dto->description ?? $existing->getDescription(),
            result: $dto->result ?? $existing->getResult(),
            order: $dto->order ?? $existing->getOrder(),
            surveyId: $existing->getSurveyId(),
            createdAt: $existing->getCreatedAt(),
            updatedAt: now(),
        );

        return $this->repository->save($updated);
    }
}
