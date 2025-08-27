<?php

namespace App\Domain\Parking\ValueObjects;

final class Capacity
{
    public function __construct(private readonly int $value)
    {
        if ($this->value < 0) {
            throw new \InvalidArgumentException('Capacity cannot be negative.');
        }

        if ($this->value > 10000) {
            throw new \InvalidArgumentException('Capacity cannot exceed 10000.');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(Capacity $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }
}
