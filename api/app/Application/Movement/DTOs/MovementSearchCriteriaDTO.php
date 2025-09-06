<?php

namespace App\Application\Movement\DTOs;

final class MovementSearchCriteriaDTO
{
    public function __construct(
        public readonly ?int $dischargeId,
        public readonly ?int $userId,
        public readonly ?string $from,
        public readonly ?string $to,
        public readonly ?string $note,
        public readonly int $page = 1,
        public readonly int $perPage = 15,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dischargeId: isset($data['discharge_id']) ? (int) $data['discharge_id'] : null,
            userId: isset($data['user_id']) ? (int) $data['user_id'] : null,
            from: $data['from'] ?? null,
            to: $data['to'] ?? null,
            note: $data['note'] ?? null,
            page: (int) ($data['page'] ?? 1),
            perPage: (int) ($data['per_page'] ?? 15),
        );
    }
}
