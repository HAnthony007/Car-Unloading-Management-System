<?php

namespace App\Domain\Dock\ValueObjects;

final class DockId
{
    public function __construct(private readonly int $value)
    {
        if ($this->value <= 0) {
            throw new \InvalidArgumentException('Dock ID must be a positive integer.');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(DockId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }
}
