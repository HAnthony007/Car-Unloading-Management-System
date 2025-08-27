<?php

namespace App\Application\SurveyCheckpoint\UseCases;

use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;

final class ListSurveyCheckpointsUseCase
{
    public function __construct(private readonly SurveyCheckpointRepositoryInterface $repository) {}

    public function execute(?int $surveyId = null): array
    {
        if ($surveyId) {
            return $this->repository->findBySurveyId(new SurveyId($surveyId));
        }

        return $this->repository->findAll();
    }
}
