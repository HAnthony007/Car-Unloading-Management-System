<?php

namespace App\Application\Document\DTOs;

final class DocumentSearchCriteriaDTO
{
    public function __construct(
        public readonly ?int $followUpFileId,
        public readonly ?string $type,
        public readonly ?string $fromDate,
        public readonly ?string $toDate,
        public readonly ?int $portCallId,
        public readonly int $page,
        public readonly int $perPage,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            followUpFileId: isset($data['follow_up_file_id']) ? (int) $data['follow_up_file_id'] : null,
            type: $data['type'] ?? null,
            fromDate: $data['from_date'] ?? null,
            toDate: $data['to_date'] ?? null,
            portCallId: isset($data['port_call_id']) ? (int) $data['port_call_id'] : null,
            page: (int) ($data['page'] ?? 1),
            perPage: (int) ($data['per_page'] ?? 15),
        );
    }
}
