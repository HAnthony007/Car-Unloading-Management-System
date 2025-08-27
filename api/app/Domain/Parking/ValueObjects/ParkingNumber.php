<?php

namespace App\Domain\Parking\ValueObjects;

final class ParkingNumber
{
    public function __construct(private readonly ?string $value)
    {
        if ($this->value !== null) {
            if (empty(trim($this->value))) {
                throw new \InvalidArgumentException('Parking number cannot be empty when provided.');
            }

            if (strlen($this->value) > 50) {
                throw new \InvalidArgumentException('Parking number cannot exceed 50 characters.');
            }
        }
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function equals(?ParkingNumber $other): bool
    {
        if ($other === null) {
            return $this->value === null;
        }

        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value ?? '';
    }
}
