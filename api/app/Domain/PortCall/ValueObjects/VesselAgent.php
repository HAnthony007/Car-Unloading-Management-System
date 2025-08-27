<?php

namespace App\Domain\PortCall\ValueObjects;

final class VesselAgent
{
    private string $value;

    public function __construct(string $value)
    {
        $value = trim($value);
        if ($value === '') {
            throw new \InvalidArgumentException('Vessel agent is required.');
        }
        $this->value = $value;
    }

    public function getValue(): string
    {
        return $this->value;
    }
}
