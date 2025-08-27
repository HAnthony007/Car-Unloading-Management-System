<?php

namespace App\Domain\Vehicle\ValueObjects;

use InvalidArgumentException;

final class VehicleId
{
    public function __construct(private readonly int $value)
    {
        if ($this->value <= 0) {
            throw new InvalidArgumentException('Vehicle ID must be greater than 0');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(VehicleId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string)$this->value;
    }
}
