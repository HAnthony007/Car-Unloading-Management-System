<?php

namespace App\Application\Survey\UseCases;

use App\Application\Survey\DTOs\CreateSurveyDTO;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Survey\Entities\Survey;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Domain\User\ValueObjects\UserId;

final class CreateSurveyUseCase
{
    public function __construct(private readonly SurveyRepositoryInterface $repository) {}

    public function execute(CreateSurveyDTO $dto): Survey
    {
        $entity = new Survey(
            surveyId: null,
            date: $dto->getDateVO(),
            result: $dto->getResultVO(),
            userId: new UserId($dto->userId),
            followUpFileId: new FollowUpFileId($dto->followUpFileId),
        );

        return $this->repository->save($entity);
    }
}
