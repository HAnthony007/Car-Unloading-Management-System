<?php

namespace App\Domain\Dock\ValueObjects;

final class Location
{
    public function __construct(private readonly string $value)
    {
    $trimmed = trim($this->value);
    if ($trimmed === '') {
            throw new \InvalidArgumentException('Location cannot be empty.');
        }

    if (strlen($trimmed) > 255) {
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
