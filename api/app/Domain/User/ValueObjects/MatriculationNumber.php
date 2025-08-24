<?php

namespace App\Domain\User\ValueObjects;

use InvalidArgumentException;

final class MatriculationNumber
{
    private readonly string $value;

    public function __construct(string $matriculationNumber)
    {
        $this->validate($matriculationNumber);
        $this->value = $matriculationNumber;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function getPrefix(): string
    {
        return explode('-', $this->value)[0] ?? '';
    }

    public function getYear(): ?int
    {
        $parts = explode('-', $this->value);
        return isset($parts[1]) ? (int) $parts[1] : null;
    }

    public function getSequence(): ?string
    {
        $parts = explode('-', $this->value);
        return $parts[2] ?? null;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    public function equals(MatriculationNumber $other): bool
    {
        return $this->value === $other->value;
    }

    public function validate(string $matriculationNumber): void
    {
        if (empty($matriculationNumber)) {
            throw new InvalidArgumentException('Matriculation number is required');
        }

        if (strlen($matriculationNumber) < 3) {
            throw new InvalidArgumentException('Matriculation number too short');
        }

        if (strlen($matriculationNumber) > 50) {
            throw new InvalidArgumentException('Matriculation number too long');
        }

        if (!preg_match('/^[A-Z0-9-]+$/', strtoupper($matriculationNumber))) {
            throw new InvalidArgumentException('Invalid matriculation number');
        }
    }
}