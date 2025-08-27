<?php

namespace App\Domain\Document\ValueObjects;

use InvalidArgumentException;

final class DocumentType
{
    public function __construct(private readonly string $value)
    {
        $trimmed = trim($value);
        if ($trimmed === '') {
            throw new InvalidArgumentException('Document type cannot be empty');
        }
    }

    public function getValue(): string
    {
        return strtolower(trim($this->value));
    }

    public function equals(DocumentType $other): bool
    {
        return $this->getValue() === $other->getValue();
    }

    public function __toString(): string
    {
        return $this->getValue();
    }
}
