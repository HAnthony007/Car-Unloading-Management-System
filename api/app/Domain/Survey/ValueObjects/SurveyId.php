<?php

namespace App\Domain\Survey\ValueObjects;

use InvalidArgumentException;

final class SurveyId
{
    public function __construct(private readonly int $value)
    {
        if ($this->value <= 0) {
            throw new InvalidArgumentException('Survey ID must be greater than 0');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(SurveyId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }
}
