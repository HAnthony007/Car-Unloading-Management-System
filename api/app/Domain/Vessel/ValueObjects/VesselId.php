<?php

namespace App\Domain\Vessel\ValueObjects;

final class VesselId
{
    public function __construct(private readonly int $value)
    {
        if ($this->value <= 0) {
            throw new \InvalidArgumentException('Vessel ID must be a positive integer.');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(VesselId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }
}
