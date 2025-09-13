<?php

namespace App\Application\Survey\UseCases;

use App\Application\Survey\DTOs\CreateSurveyDTO;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Survey\Entities\Survey;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface; // agent
use App\Domain\User\ValueObjects\UserId;

final class CreateSurveyUseCase
{
    public function __construct(private readonly SurveyRepositoryInterface $repository) {}

    public function execute(CreateSurveyDTO $dto): Survey
    {
        $entity = new Survey(
            surveyId: null,
            surveyDate: $dto->getSurveyDateVO(),
            surveyName: $dto->getNameVO(),
            surveyDescription: $dto->getDescriptionVO(),
            overallStatus: $dto->getStatusVO(),
            agentId: new UserId($dto->agentId),
            dischargeId: new DischargeId($dto->dischargeId),
        );

        return $this->repository->save($entity);
    }
}
