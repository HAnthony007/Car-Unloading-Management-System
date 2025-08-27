<?php

namespace App\Domain\Parking\ValueObjects;

final class ParkingId
{
    public function __construct(private readonly int $value)
    {
        if ($this->value <= 0) {
            throw new \InvalidArgumentException('Parking ID must be a positive integer.');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(ParkingId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }
}
