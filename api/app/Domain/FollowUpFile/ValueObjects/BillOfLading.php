<?php

namespace App\Domain\FollowUpFile\ValueObjects;

use InvalidArgumentException;

final class BillOfLading
{
    public function __construct(private string $value)
    {
        $trimmed = trim($this->value);
        if ($trimmed === '') {
            throw new InvalidArgumentException('Bill of lading cannot be empty');
        }
        if (strlen($trimmed) > 255) {
            throw new InvalidArgumentException('Bill of lading is too long');
        }
        $this->value = strtoupper($trimmed);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(BillOfLading $other): bool
    {
        return $this->getValue() === $other->getValue();
    }

    public function __toString(): string
    {
        return $this->getValue();
    }
}
