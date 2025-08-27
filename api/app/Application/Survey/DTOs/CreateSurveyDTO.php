<?php

namespace App\Application\Survey\DTOs;

use App\Domain\Survey\ValueObjects\SurveyDate;
use App\Domain\Survey\ValueObjects\SurveyResult;
use Carbon\Carbon;

final class CreateSurveyDTO
{
    public function __construct(
        public readonly string $date,
        public readonly string $result,
        public readonly int $userId,
        public readonly int $followUpFileId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            date: $data['date'] ?? Carbon::now()->toDateString(),
            result: $data['result'] ?? 'PENDING',
            userId: (int) ($data['user_id'] ?? 0),
            followUpFileId: (int) ($data['follow_up_file_id'] ?? 0),
        );
    }

    public function getDateVO(): SurveyDate
    {
        return new SurveyDate(Carbon::parse($this->date)->startOfDay());
    }

    public function getResultVO(): SurveyResult
    {
        return new SurveyResult($this->result);
    }
}
