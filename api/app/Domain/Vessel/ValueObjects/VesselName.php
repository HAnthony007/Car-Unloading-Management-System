<?php

namespace App\Domain\Vessel\ValueObjects;

final class VesselName
{
    private string $value;

    public function __construct(string $value)
    {
        $trimmed = trim($value);
        if ($trimmed === '' || mb_strlen($trimmed) > 150) {
            throw new \InvalidArgumentException('Vessel name must be non-empty and at most 150 characters.');
        }
        $this->value = $trimmed;
    }

    public function getValue(): string
    {
        return $this->value;
    }
}
