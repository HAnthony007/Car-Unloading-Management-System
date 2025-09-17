<?php

namespace App\Application\Movement\DTOs;

final class UpdateMovementDTO
{
    public function __construct(
        public readonly int $movementId,
        public readonly ?string $note,
        public readonly ?string $timestamp,
        public readonly ?string $from,
        public readonly ?string $to,
    public readonly ?float $fromLatitude = null,
    public readonly ?float $fromLongitude = null,
    public readonly ?float $toLatitude = null,
    public readonly ?float $toLongitude = null,
        public readonly ?string $parkingNumber = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            movementId: (int) ($data['movement_id'] ?? 0),
            note: $data['note'] ?? null,
            timestamp: $data['timestamp'] ?? null,
            from: $data['from'] ?? null,
            to: $data['to'] ?? null,
            fromLatitude: isset($data['from_latitude']) ? (float) $data['from_latitude'] : null,
            fromLongitude: isset($data['from_longitude']) ? (float) $data['from_longitude'] : null,
            toLatitude: isset($data['to_latitude']) ? (float) $data['to_latitude'] : null,
            toLongitude: isset($data['to_longitude']) ? (float) $data['to_longitude'] : null,
            parkingNumber: $data['parking_number'] ?? null,
        );
    }
}
