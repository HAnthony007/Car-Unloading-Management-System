<?php

namespace App\Domain\Movement\ValueObjects;

use InvalidArgumentException;

final class MovementId
{
    public function __construct(private readonly int $value)
    {
        if ($this->value <= 0) {
            throw new InvalidArgumentException('Movement ID must be greater than 0');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(MovementId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }
}
