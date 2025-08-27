<?php

namespace App\Domain\FollowUpFile\Entities;

use App\Domain\FollowUpFile\ValueObjects\BillOfLading;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\FollowUpFile\ValueObjects\FollowUpStatus;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use Carbon\Carbon;

final class FollowUpFile
{
    public function __construct(
        private readonly ?FollowUpFileId $followUpFileId,
        private readonly BillOfLading $billOfLading,
        private readonly FollowUpStatus $status,
        private readonly VehicleId $vehicleId,
        private readonly PortCallId $portCallId,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getFollowUpFileId(): ?FollowUpFileId
    {
        return $this->followUpFileId;
    }

    public function getBillOfLading(): BillOfLading
    {
        return $this->billOfLading;
    }

    public function getStatus(): FollowUpStatus
    {
        return $this->status;
    }

    public function getVehicleId(): VehicleId
    {
        return $this->vehicleId;
    }

    public function getPortCallId(): PortCallId
    {
        return $this->portCallId;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    public function toArray(): array
    {
        return [
            'follow_up_file_id' => $this->followUpFileId?->getValue(),
            'bill_of_lading' => $this->billOfLading->getValue(),
            'status' => $this->status->getValue(),
            'vehicle_id' => $this->vehicleId->getValue(),
            'port_call_id' => $this->portCallId->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
