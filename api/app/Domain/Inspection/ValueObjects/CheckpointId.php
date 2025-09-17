<?php

namespace App\Domain\Inspection\ValueObjects;

final class CheckpointId
{
    public function __construct(private readonly int $value) {}

    public function getValue(): int
    {
        return $this->value;
    }
}
