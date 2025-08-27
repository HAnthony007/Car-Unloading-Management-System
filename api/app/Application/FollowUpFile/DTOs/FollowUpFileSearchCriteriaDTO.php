<?php

namespace App\Application\FollowUpFile\DTOs;

final class FollowUpFileSearchCriteriaDTO
{
    public function __construct(
        public readonly ?string $billOfLading,
        public readonly ?string $status,
        public readonly ?int $vehicleId,
        public readonly ?int $portCallId,
        public readonly int $page,
        public readonly int $perPage,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            billOfLading: $data['bill_of_lading'] ?? null,
            status: $data['status'] ?? null,
            vehicleId: isset($data['vehicle_id']) ? (int) $data['vehicle_id'] : null,
            portCallId: isset($data['port_call_id']) ? (int) $data['port_call_id'] : null,
            page: max(1, (int) ($data['page'] ?? 1)),
            perPage: max(1, min(100, (int) ($data['per_page'] ?? 15))),
        );
    }
}
