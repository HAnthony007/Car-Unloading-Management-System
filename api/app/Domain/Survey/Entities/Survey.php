<?php

namespace App\Domain\Survey\Entities;

use App\Domain\Discharge\ValueObjects\DischargeId; // now represents survey_date (datetime)
use App\Domain\Survey\ValueObjects\SurveyDate;
use App\Domain\Survey\ValueObjects\SurveyId; // agent_id
use App\Domain\Survey\ValueObjects\SurveyStatus;
use App\Domain\User\ValueObjects\UserId;
use Carbon\Carbon;

final class Survey
{
    public function __construct(
        private readonly ?SurveyId $surveyId,
        private readonly SurveyDate $surveyDate,
        private readonly SurveyStatus $overallStatus,
        private readonly UserId $agentId,
        private readonly DischargeId $dischargeId,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getSurveyId(): ?SurveyId
    {
        return $this->surveyId;
    }

    public function getSurveyDate(): SurveyDate
    {
        return $this->surveyDate;
    }

    public function getOverallStatus(): SurveyStatus
    {
        return $this->overallStatus;
    }

    public function getAgentId(): UserId
    {
        return $this->agentId;
    }

    public function getDischargeId(): DischargeId
    {
        return $this->dischargeId;
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
            'survey_date' => $this->surveyDate->getValue()?->toISOString(),
            'overall_status' => $this->overallStatus->getValue(),
            'agent_id' => $this->agentId->getValue(),
            'discharge_id' => $this->dischargeId->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
