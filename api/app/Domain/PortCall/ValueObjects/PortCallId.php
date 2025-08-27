<?php

namespace App\Domain\PortCall\ValueObjects;

final class PortCallId
{
    public function __construct(private readonly int $value) {}

    public function getValue(): int
    {
        return $this->value;
    }
}
