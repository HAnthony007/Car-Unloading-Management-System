<?php

namespace App\Application\Movement\DTOs;

final class CreateMovementDTO
{
    public function __construct(
        public readonly ?string $note,
        public readonly string $timestamp, // ISO string or Y-m-d H:i:s
        public readonly ?string $from,
        public readonly ?string $to,
    public readonly ?float $fromLatitude,
    public readonly ?float $fromLongitude,
    public readonly ?float $toLatitude,
    public readonly ?float $toLongitude,
        public readonly ?string $parkingNumber,
        public readonly int $dischargeId,
        public readonly int $userId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            note: $data['note'] ?? null,
            timestamp: $data['timestamp'] ?? now()->toDateTimeString(),
            from: $data['from'] ?? null,
            to: $data['to'] ?? null,
            fromLatitude: isset($data['from_latitude']) ? (float) $data['from_latitude'] : null,
            fromLongitude: isset($data['from_longitude']) ? (float) $data['from_longitude'] : null,
            toLatitude: isset($data['to_latitude']) ? (float) $data['to_latitude'] : null,
            toLongitude: isset($data['to_longitude']) ? (float) $data['to_longitude'] : null,
            parkingNumber: $data['parking_number'] ?? null,
            dischargeId: (int) ($data['discharge_id'] ?? 0),
            userId: (int) ($data['user_id'] ?? 0),
        );
    }
}
