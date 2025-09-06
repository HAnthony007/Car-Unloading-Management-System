<?php

namespace App\Application\Survey\DTOs;

use App\Domain\Survey\ValueObjects\SurveyDate;
use App\Domain\Survey\ValueObjects\SurveyStatus;
use Carbon\Carbon;

final class CreateSurveyDTO
{
    public function __construct(
        public readonly string $surveyDate,
        public readonly string $overallStatus,
        public readonly int $agentId,
        public readonly int $dischargeId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            surveyDate: $data['survey_date'] ?? Carbon::now()->toDateTimeString(),
            overallStatus: $data['overall_status'] ?? 'PENDING',
            agentId: (int) ($data['agent_id'] ?? 0),
            dischargeId: (int) ($data['discharge_id'] ?? 0),
        );
    }

    public function getSurveyDateVO(): SurveyDate
    {
        return new SurveyDate(Carbon::parse($this->surveyDate));
    }

    public function getStatusVO(): SurveyStatus
    {
        return new SurveyStatus($this->overallStatus);
    }
}
