<?php

namespace App\Application\Survey\UseCases;

use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Domain\Survey\ValueObjects\SurveyId;

final class DeleteSurveyUseCase
{
    public function __construct(private readonly SurveyRepositoryInterface $repository) {}

    public function execute(int $id): bool
    {
        // Ensure the survey exists before attempting deletion
        $existing = $this->repository->findById(new SurveyId($id));
        if (! $existing) {
            throw new \RuntimeException('Survey not found.');
        }

    $this->repository->delete(new SurveyId($id));
    return true;
    }
}
