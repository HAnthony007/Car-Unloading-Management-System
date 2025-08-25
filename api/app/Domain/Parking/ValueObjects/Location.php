<?php

namespace App\Domain\Parking\ValueObjects;

final class Location
{
    public function __construct(private readonly string $value)
    {
        if (empty(trim($this->value))) {
            throw new \InvalidArgumentException('Location cannot be empty.');
        }

        if (strlen($this->value) > 255) {
            throw new \InvalidArgumentException('Location cannot exceed 255 characters.');
        }
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(Location $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
