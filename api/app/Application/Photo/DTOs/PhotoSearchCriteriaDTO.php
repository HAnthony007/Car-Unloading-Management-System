<?php

namespace App\Application\Photo\DTOs;

final class PhotoSearchCriteriaDTO
{
    public function __construct(
        public readonly ?int $followUpFileId,
        public readonly ?int $checkpointId,
        public readonly ?string $fromDate,
        public readonly ?string $toDate,
        public readonly int $page,
        public readonly int $perPage,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            followUpFileId: isset($data['follow_up_file_id']) ? (int) $data['follow_up_file_id'] : null,
            checkpointId: isset($data['checkpoint_id']) ? (int) $data['checkpoint_id'] : null,
            fromDate: $data['from_date'] ?? null,
            toDate: $data['to_date'] ?? null,
            page: max(1, (int) ($data['page'] ?? 1)),
            perPage: max(1, min(100, (int) ($data['per_page'] ?? 15))),
        );
    }
}
