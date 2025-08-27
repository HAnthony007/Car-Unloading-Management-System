<?php

namespace App\Application\Survey\DTOs;

final class SurveySearchCriteriaDTO
{
    public function __construct(
        public readonly ?string $result = null,
        public readonly ?int $userId = null,
        public readonly ?int $followUpFileId = null,
        public readonly int $page = 1,
        public readonly int $perPage = 15,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            result: $data['result'] ?? null,
            userId: isset($data['user_id']) ? (int) $data['user_id'] : null,
            followUpFileId: isset($data['follow_up_file_id']) ? (int) $data['follow_up_file_id'] : null,
            page: (int) ($data['page'] ?? 1),
            perPage: (int) ($data['per_page'] ?? 15),
        );
    }
}
