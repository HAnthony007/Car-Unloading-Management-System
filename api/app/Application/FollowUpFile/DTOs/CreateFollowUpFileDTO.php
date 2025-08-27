<?php

namespace App\Application\FollowUpFile\DTOs;

use App\Domain\FollowUpFile\ValueObjects\BillOfLading;
use App\Domain\FollowUpFile\ValueObjects\FollowUpStatus;

final class CreateFollowUpFileDTO
{
    public function __construct(
        public readonly string $billOfLading,
        public readonly string $status,
        public readonly int $vehicleId,
        public readonly int $portCallId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            billOfLading: $data['bill_of_lading'] ?? '',
            status: $data['status'] ?? 'OPEN',
            vehicleId: (int) ($data['vehicle_id'] ?? 0),
            portCallId: (int) ($data['port_call_id'] ?? 0),
        );
    }

    public function getBillOfLadingVO(): BillOfLading
    {
        return new BillOfLading($this->billOfLading);
    }

    public function getStatusVO(): FollowUpStatus
    {
        return new FollowUpStatus($this->status);
    }
}
