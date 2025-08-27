<?php

namespace App\Domain\Discharge\Entities;

use App\Domain\Discharge\ValueObjects\DateTimeValue;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\PortCall\ValueObjects\PortCallId;
use Carbon\Carbon;

final class Discharge
{
    public function __construct(
        private readonly ?DischargeId $dischargeId,
        private readonly DateTimeValue $dischargeDate,
        private readonly PortCallId $portCallId,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getDischargeId(): ?DischargeId
    {
        return $this->dischargeId;
    }

    public function getDischargeDate(): DateTimeValue
    {
        return $this->dischargeDate;
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
            'discharge_id' => $this->dischargeId?->getValue(),
            'discharge_date' => $this->dischargeDate->getValue()?->toIso8601String(),
            'port_call_id' => $this->portCallId->getValue(),
            'created_at' => $this->createdAt?->toIso8601String(),
            'updated_at' => $this->updatedAt?->toIso8601String(),
        ];
    }
}
