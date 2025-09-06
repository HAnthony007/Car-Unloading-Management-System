<?php

namespace App\Application\Survey\DTOs;

use App\Domain\Survey\ValueObjects\SurveyDate;
use App\Domain\Survey\ValueObjects\SurveyStatus;
use Carbon\Carbon;

final class UpdateSurveyDTO
{
    public function __construct(
        public readonly int $surveyId,
        public readonly ?string $surveyDate = null,
        public readonly ?string $overallStatus = null,
        public readonly ?int $agentId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            surveyId: (int) $data['survey_id'],
            surveyDate: $data['survey_date'] ?? null,
            overallStatus: $data['overall_status'] ?? null,
            agentId: isset($data['agent_id']) ? (int) $data['agent_id'] : null,
        );
    }

    public function getSurveyDateVOOrNull(): ?SurveyDate
    {
        return $this->surveyDate ? new SurveyDate(Carbon::parse($this->surveyDate)) : null;
    }

    public function getStatusVOOrNull(): ?SurveyStatus
    {
        return $this->overallStatus ? new SurveyStatus($this->overallStatus) : null;
    }
}
