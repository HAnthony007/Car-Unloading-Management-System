<?php

namespace App\Domain\Discharge\ValueObjects;

final class DischargeId
{
    public function __construct(private readonly int $value) {}

    public function getValue(): int
    {
        return $this->value;
    }
}
