<?php

namespace App\Application\SurveyCheckpoint\UseCases;

use App\Application\SurveyCheckpoint\DTOs\CreateSurveyCheckpointDTO;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;

final class CreateSurveyCheckpointUseCase
{
    public function __construct(private readonly SurveyCheckpointRepositoryInterface $repository) {}

    public function execute(CreateSurveyCheckpointDTO $dto): SurveyCheckpoint
    {
        $entity = new SurveyCheckpoint(
            checkpointId: null,
            title: $dto->getTitleVO(),
            comment: $dto->getCommentVOOrNull(),
            surveyId: new SurveyId($dto->surveyId),
        );

        return $this->repository->save($entity);
    }
}
