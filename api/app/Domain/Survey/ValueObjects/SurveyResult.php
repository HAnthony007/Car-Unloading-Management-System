<?php

namespace App\Domain\Survey\ValueObjects;

use InvalidArgumentException;

final class SurveyResult
{
    public const ALLOWED = ['PASSED', 'FAILED', 'PENDING'];

    public function __construct(private string $value)
    {
        $upper = strtoupper(trim($this->value));
        if (! in_array($upper, self::ALLOWED, true)) {
            throw new InvalidArgumentException('Invalid survey result value. Allowed: '.implode(', ', self::ALLOWED));
        }
        $this->value = $upper;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(SurveyResult $other): bool
    {
        return $this->value === $other->value;
    }
}
