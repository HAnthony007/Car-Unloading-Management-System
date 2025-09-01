<?php

namespace App\Domain\FollowUpFile\ValueObjects;

use InvalidArgumentException;

final class FollowUpStatus
{
    public const ALLOWED = ['OPEN', 'IN_PROGRESS', 'CLOSED', 'PENDING'];

    public function __construct(private string $value)
    {
        $upper = strtoupper(trim($this->value));
        if (! in_array($upper, self::ALLOWED, true)) {
            throw new InvalidArgumentException('Invalid follow up status');
        }
        $this->value = $upper;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(FollowUpStatus $other): bool
    {
        return $this->value === $other->value;
    }
}
