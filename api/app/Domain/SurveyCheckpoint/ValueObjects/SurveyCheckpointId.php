<?php

namespace App\Domain\SurveyCheckpoint\ValueObjects;

final class SurveyCheckpointId
{
    public function __construct(private readonly int $value)
    {
        if ($this->value <= 0) {
            throw new \InvalidArgumentException('SurveyCheckpointId must be positive.');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }
}
