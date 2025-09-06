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

        $surveyDate = $dto->getSurveyDateVOOrNull() ?? $existing->getSurveyDate();
        $status = $dto->getStatusVOOrNull() ?? $existing->getOverallStatus();
        $agent = $dto->agentId ? new \App\Domain\User\ValueObjects\UserId($dto->agentId) : $existing->getAgentId();

        $updated = new \App\Domain\Survey\Entities\Survey(
            surveyId: $existing->getSurveyId(),
            surveyDate: $surveyDate,
            overallStatus: $status,
            agentId: $agent,
            dischargeId: $existing->getDischargeId(),
            createdAt: $existing->getCreatedAt(),
            updatedAt: now(),
        );

        return $this->repository->save($updated);
    }
}
