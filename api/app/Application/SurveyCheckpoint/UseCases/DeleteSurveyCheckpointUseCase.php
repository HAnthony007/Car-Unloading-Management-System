<?php

namespace App\Application\SurveyCheckpoint\UseCases;

use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;

final class DeleteSurveyCheckpointUseCase
{
    public function __construct(private readonly SurveyCheckpointRepositoryInterface $repository) {}

    public function execute(int $id): void
    {
        $deleted = $this->repository->delete(new SurveyCheckpointId($id));
        if (! $deleted) {
            throw new \RuntimeException('SurveyCheckpoint not found.');
        }
    }
}
