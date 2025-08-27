<?php

namespace App\Domain\Survey\Repositories;

use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Survey\Entities\Survey;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\User\ValueObjects\UserId;

interface SurveyRepositoryInterface
{
    public function findById(SurveyId $id): ?Survey;

    /** @return array<int, Survey> */
    public function findAll(): array;

    /** @return array<int, Survey> */
    public function findByUserId(UserId $userId): array;

    /** @return array<int, Survey> */
    public function findByFollowUpFileId(FollowUpFileId $followUpFileId): array;

    public function save(Survey $survey): Survey;

    public function delete(SurveyId $id): bool;
}
