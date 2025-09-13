<?php

namespace App\Domain\Survey\ValueObjects;

final class SurveyDescription
{
    private ?string $value;

    public function __construct(?string $value)
    {
        $this->value = $value !== null ? trim($value) : null;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }
}
