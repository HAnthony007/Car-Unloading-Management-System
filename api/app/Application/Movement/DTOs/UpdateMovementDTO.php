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
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            movementId: (int) ($data['movement_id'] ?? 0),
            note: $data['note'] ?? null,
            timestamp: $data['timestamp'] ?? null,
            from: $data['from'] ?? null,
            to: $data['to'] ?? null,
        );
    }
}
