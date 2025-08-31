<?php

namespace App\Application\Movement\DTOs;

final class CreateMovementDTO
{
    public function __construct(
        public readonly ?string $note,
        public readonly string $timestamp, // ISO string or Y-m-d H:i:s
        public readonly ?string $from,
        public readonly ?string $to,
        public readonly ?string $parkingNumber,
        public readonly int $vehicleId,
        public readonly int $userId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            note: $data['note'] ?? null,
            timestamp: $data['timestamp'] ?? now()->toDateTimeString(),
            from: $data['from'] ?? null,
            to: $data['to'] ?? null,
            parkingNumber: $data['parking_number'] ?? null,
            vehicleId: (int) ($data['vehicle_id'] ?? 0),
            userId: (int) ($data['user_id'] ?? 0),
        );
    }
}
