<?php

namespace App\Domain\FollowUpFile\ValueObjects;

use InvalidArgumentException;

final class FollowUpFileId
{
    public function __construct(private readonly int $value)
    {
        if ($this->value <= 0) {
            throw new InvalidArgumentException('FollowUpFile ID must be greater than 0');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(FollowUpFileId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }
}
