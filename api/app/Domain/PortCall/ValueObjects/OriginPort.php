<?php

namespace App\Domain\PortCall\ValueObjects;

final class OriginPort
{
    private string $value;

    public function __construct(string $value)
    {
        $value = trim($value);
        if ($value === '') {
            throw new \InvalidArgumentException('Origin port is required.');
        }
        $this->value = $value;
    }

    public function getValue(): string
    {
        return $this->value;
    }
}
