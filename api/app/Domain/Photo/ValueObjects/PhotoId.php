<?php

namespace App\Domain\Photo\ValueObjects;

use InvalidArgumentException;

final class PhotoId
{
    public function __construct(private readonly int $value)
    {
        if ($this->value <= 0) {
            throw new InvalidArgumentException('Photo ID must be greater than 0');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(PhotoId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }
}
