<?php

namespace App\Application\FollowUpFile\DTOs;

use App\Domain\FollowUpFile\ValueObjects\BillOfLading;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\FollowUpFile\ValueObjects\FollowUpStatus;

final class UpdateFollowUpFileDTO
{
    public function __construct(
        public readonly int $followUpFileId,
        public readonly ?string $billOfLading,
        public readonly ?string $status,
        public readonly ?int $vehicleId,
        public readonly ?int $portCallId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            followUpFileId: (int) ($data['follow_up_file_id'] ?? 0),
            billOfLading: $data['bill_of_lading'] ?? null,
            status: $data['status'] ?? null,
            vehicleId: isset($data['vehicle_id']) ? (int) $data['vehicle_id'] : null,
            portCallId: isset($data['port_call_id']) ? (int) $data['port_call_id'] : null,
        );
    }

    public function getIdVO(): FollowUpFileId
    {
        return new FollowUpFileId($this->followUpFileId);
    }

    public function getBillOfLadingVO(): ?BillOfLading
    {
        return $this->billOfLading ? new BillOfLading($this->billOfLading) : null;
    }

    public function getStatusVO(): ?FollowUpStatus
    {
        return $this->status ? new FollowUpStatus($this->status) : null;
    }
}
