<?php

namespace App\Domain\Movement\Entities;

use App\Domain\Movement\ValueObjects\MovementId;
use App\Domain\Movement\ValueObjects\VehicleLocation;
use App\Domain\User\ValueObjects\UserId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use Carbon\Carbon;

final class Movement
{
    public function __construct(
        private readonly ?MovementId $movementId,
        private readonly ?string $note,
        private readonly Carbon $timestamp,
        private readonly VehicleLocation $from,
        private readonly VehicleLocation $to,
        private readonly VehicleId $vehicleId,
        private readonly UserId $userId,
        private readonly ?string $parkingNumber = null,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getMovementId(): ?MovementId
    {
        return $this->movementId;
    }

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function getTimestamp(): Carbon
    {
        return $this->timestamp;
    }

    public function getFrom(): VehicleLocation
    {
        return $this->from;
    }

    public function getTo(): VehicleLocation
    {
        return $this->to;
    }

    public function getVehicleId(): VehicleId
    {
        return $this->vehicleId;
    }

    public function getUserId(): UserId
    {
        return $this->userId;
    }

    public function getParkingNumber(): ?string
    {
        return $this->parkingNumber;
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
            'movement_id' => $this->movementId?->getValue(),
            'note' => $this->note,
            'timestamp' => $this->timestamp->toISOString(),
            'from' => $this->from->getValue(),
            'to' => $this->to->getValue(),
            'vehicle_id' => $this->vehicleId->getValue(),
            'user_id' => $this->userId->getValue(),
            'parking_number' => $this->parkingNumber,
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
