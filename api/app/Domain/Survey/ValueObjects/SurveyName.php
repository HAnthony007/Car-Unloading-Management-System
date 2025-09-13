<?php

namespace App\Domain\Survey\ValueObjects;

use InvalidArgumentException;

final class SurveyName
{
    private string $value;

    public function __construct(string $value)
    {
        $trimmed = trim($value);
        if ($trimmed === '') {
            throw new InvalidArgumentException('Survey name cannot be empty');
        }
        if (mb_strlen($trimmed) > 255) {
            throw new InvalidArgumentException('Survey name must be at most 255 characters');
        }
        $this->value = $trimmed;
    }

    public function getValue(): string
    {
        return $this->value;
    }
}
