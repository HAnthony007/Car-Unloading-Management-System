<?php

namespace App\Domain\SurveyCheckpoint\Repositories;

use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;

interface SurveyCheckpointRepositoryInterface
{
    public function findById(SurveyCheckpointId $id): ?SurveyCheckpoint;

    /** @return array<int, SurveyCheckpoint> */
    public function findAll(): array;

    /** @return array<int, SurveyCheckpoint> */
    public function findBySurveyId(SurveyId $surveyId): array;

    public function save(SurveyCheckpoint $checkpoint): SurveyCheckpoint;

    public function delete(SurveyCheckpointId $id): bool;
}
