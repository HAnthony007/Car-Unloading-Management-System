<?php

namespace App\Application\Survey\UseCases;

use App\Application\Survey\DTOs\UpdateSurveyDTO;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Domain\Survey\ValueObjects\SurveyId;

final class UpdateSurveyUseCase
{
    public function __construct(private readonly SurveyRepositoryInterface $repository) {}

    public function execute(UpdateSurveyDTO $dto): \App\Domain\Survey\Entities\Survey
    {
        $existing = $this->repository->findById(new SurveyId($dto->surveyId));
        if (! $existing) {
            throw new \RuntimeException('Survey not found.');
        }

        $date = $dto->getDateVOOrNull() ?? $existing->getDate();
        $result = $dto->getResultVOOrNull() ?? $existing->getResult();

        $updated = new \App\Domain\Survey\Entities\Survey(
            surveyId: $existing->getSurveyId(),
            date: $date,
            result: $result,
            userId: $existing->getUserId(),
            followUpFileId: $existing->getFollowUpFileId(),
            createdAt: $existing->getCreatedAt(),
            updatedAt: now(),
        );

        return $this->repository->save($updated);
    }
}
