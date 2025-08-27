<?php

namespace App\Application\Survey\UseCases;

use App\Domain\Survey\Entities\Survey;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Domain\Survey\ValueObjects\SurveyId;

final class GetSurveyUseCase
{
    public function __construct(private readonly SurveyRepositoryInterface $repository) {}

    public function execute(int $id): Survey
    {
        $survey = $this->repository->findById(new SurveyId($id));
        if (! $survey) {
            throw new \RuntimeException('Survey not found.');
        }

        return $survey;
    }
}
