<?php

namespace App\Domain\SurveyCheckpoint\ValueObjects;

final class CheckpointComment
{
    public function __construct(private readonly string $value)
    {
        if (strlen($this->value) > 1000) {
            throw new \InvalidArgumentException('Checkpoint comment cannot exceed 1000 characters.');
        }
    }

    public function getValue(): string
    {
        return $this->value;
    }
}
