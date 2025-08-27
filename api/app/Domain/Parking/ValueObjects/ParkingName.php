<?php

namespace App\Domain\Parking\ValueObjects;

final class ParkingName
{
    public function __construct(private readonly string $value)
    {
        if (empty(trim($this->value))) {
            throw new \InvalidArgumentException('Parking name cannot be empty.');
        }

        if (strlen($this->value) > 100) {
            throw new \InvalidArgumentException('Parking name cannot exceed 100 characters.');
        }
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(ParkingName $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
