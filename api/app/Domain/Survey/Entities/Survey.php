<?php

namespace App\Domain\Survey\Entities;

use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Survey\ValueObjects\SurveyDate;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\Survey\ValueObjects\SurveyResult;
use App\Domain\User\ValueObjects\UserId;
use Carbon\Carbon;

final class Survey
{
    public function __construct(
        private readonly ?SurveyId $surveyId,
        private readonly SurveyDate $date,
        private readonly SurveyResult $result,
        private readonly UserId $userId,
        private readonly FollowUpFileId $followUpFileId,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getSurveyId(): ?SurveyId
    {
        return $this->surveyId;
    }

    public function getDate(): SurveyDate
    {
        return $this->date;
    }

    public function getResult(): SurveyResult
    {
        return $this->result;
    }

    public function getUserId(): UserId
    {
        return $this->userId;
    }

    public function getFollowUpFileId(): FollowUpFileId
    {
        return $this->followUpFileId;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    public function toArray(): array
    {
        return [
            'survey_id' => $this->surveyId?->getValue(),
            'date' => $this->date->getValue()?->toDateString(),
            'result' => $this->result->getValue(),
            'user_id' => $this->userId->getValue(),
            'follow_up_file_id' => $this->followUpFileId->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
