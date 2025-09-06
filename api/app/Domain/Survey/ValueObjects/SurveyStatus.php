<?php

namespace App\Domain\Survey\ValueObjects;

final class SurveyStatus
{
    public const ALLOWED = ['PASSED', 'FAILED', 'PENDING'];

    private string $value;

    public function __construct(string $value)
    {
        $upper = strtoupper($value);
        if (! in_array($upper, self::ALLOWED, true)) {
            throw new \InvalidArgumentException('Invalid survey status: '.$value);
        }
        $this->value = $upper;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(SurveyStatus $other): bool
    {
        return $this->value === $other->value;
    }
}
