<?php

namespace App\Domain\SurveyCheckpoint\ValueObjects;

final class CheckpointTitle
{
    public function __construct(private readonly string $value)
    {
        $trimmed = trim($this->value);
        if ($trimmed === '') {
            throw new \InvalidArgumentException('Checkpoint title cannot be empty.');
        }
        if (strlen($trimmed) > 255) {
            throw new \InvalidArgumentException('Checkpoint title cannot exceed 255 characters.');
        }
    }

    public function getValue(): string
    {
        return $this->value;
    }
}
