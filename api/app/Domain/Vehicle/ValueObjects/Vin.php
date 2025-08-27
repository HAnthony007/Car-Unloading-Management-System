<?php

namespace App\Domain\Vehicle\ValueObjects;

use InvalidArgumentException;

final class Vin
{
    private string $value;

    public function __construct(string $value)
    {
        $v = strtoupper(trim($value));
        if ($v === '' || strlen($v) < 5) {
            throw new InvalidArgumentException('VIN must be a non-empty string');
        }
        $this->value = $v;
    }

    public function getValue(): string { return $this->value; }
}
