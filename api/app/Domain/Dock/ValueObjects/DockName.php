<?php

namespace App\Domain\Dock\ValueObjects;

final class DockName
{
    public function __construct(private readonly string $value)
    {
        $trimmed = trim($this->value);
        if ($trimmed === '') {
            throw new \InvalidArgumentException('Dock name cannot be empty.');
        }
        if (strlen($trimmed) > 100) {
            throw new \InvalidArgumentException('Dock name cannot exceed 100 characters.');
        }
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(DockName $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
