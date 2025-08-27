<?php

namespace App\Domain\Movement\ValueObjects;

final class VehicleLocation
{
    private ?string $value;

    public function __construct(?string $value)
    {
        if ($value === null) {
            $this->value = null;
            return;
        }

        $trimmed = trim($value);
        $this->value = $trimmed === '' ? null : $trimmed;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function hasValue(): bool
    {
        return $this->value !== null && $this->value !== '';
    }
}
