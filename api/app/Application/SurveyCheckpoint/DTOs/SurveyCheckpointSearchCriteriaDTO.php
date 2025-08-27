<?php

namespace App\Application\SurveyCheckpoint\DTOs;

final class SurveyCheckpointSearchCriteriaDTO
{
    public function __construct(
        public readonly ?string $title = null,
        public readonly ?int $surveyId = null,
        public readonly int $page = 1,
        public readonly int $perPage = 15,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            title: $data['title'] ?? null,
            surveyId: isset($data['survey_id']) ? (int) $data['survey_id'] : null,
            page: (int) ($data['page'] ?? 1),
            perPage: (int) ($data['per_page'] ?? 15),
        );
    }
}
