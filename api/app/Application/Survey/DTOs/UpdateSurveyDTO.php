<?php

namespace App\Application\Survey\DTOs;

use App\Domain\Survey\ValueObjects\SurveyDate;
use App\Domain\Survey\ValueObjects\SurveyResult;
use Carbon\Carbon;

final class UpdateSurveyDTO
{
    public function __construct(
        public readonly int $surveyId,
        public readonly ?string $date = null,
        public readonly ?string $result = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            surveyId: (int) $data['survey_id'],
            date: $data['date'] ?? null,
            result: $data['result'] ?? null,
        );
    }

    public function getDateVOOrNull(): ?SurveyDate
    {
        return $this->date ? new SurveyDate(Carbon::parse($this->date)->startOfDay()) : null;
    }

    public function getResultVOOrNull(): ?SurveyResult
    {
        return $this->result ? new SurveyResult($this->result) : null;
    }
}
