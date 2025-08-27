<?php

namespace App\Application\SurveyCheckpoint\UseCases;

use App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;

final class GetSurveyCheckpointUseCase
{
    public function __construct(private readonly SurveyCheckpointRepositoryInterface $repository) {}

    public function execute(int $id): SurveyCheckpoint
    {
        $entity = $this->repository->findById(new SurveyCheckpointId($id));
        if (! $entity) {
            throw new \RuntimeException('SurveyCheckpoint not found.');
        }

        return $entity;
    }
}
