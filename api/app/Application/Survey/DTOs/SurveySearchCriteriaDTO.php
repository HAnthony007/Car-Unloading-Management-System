<?php

namespace App\Application\Survey\DTOs;

final class SurveySearchCriteriaDTO
{
    public function __construct(
        public readonly ?string $overallStatus = null,
        public readonly ?int $agentId = null,
        public readonly ?int $dischargeId = null,
        public readonly int $page = 1,
        public readonly int $perPage = 15,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            overallStatus: $data['overall_status'] ?? null,
            agentId: isset($data['agent_id']) ? (int) $data['agent_id'] : null,
            dischargeId: isset($data['discharge_id']) ? (int) $data['discharge_id'] : null,
            page: (int) ($data['page'] ?? 1),
            perPage: (int) ($data['per_page'] ?? 15),
        );
    }
}
