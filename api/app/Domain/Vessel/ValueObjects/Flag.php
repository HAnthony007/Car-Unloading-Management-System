<?php

namespace App\Domain\Vessel\ValueObjects;

final class Flag
{
    private string $value;

    public function __construct(string $value)
    {
        $trimmed = trim($value);
        if ($trimmed === '' || mb_strlen($trimmed) > 100) {
            throw new \InvalidArgumentException('Flag must be non-empty and at most 100 characters.');
        }
        $this->value = $trimmed;
    }

    public function getValue(): string
    {
        return $this->value;
    }
}
