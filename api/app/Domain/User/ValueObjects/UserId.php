<?php

namespace App\Domain\User\ValueObjects;

use InvalidArgumentException;

final class UserId
{
    public function __construct(
        private readonly int $value
    ) {
        if ($value <= 0) {
            throw new InvalidArgumentException('User ID must be greater than 0');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function equals(UserId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }
}
