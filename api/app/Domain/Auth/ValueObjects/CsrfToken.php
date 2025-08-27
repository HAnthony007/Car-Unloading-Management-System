<?php

namespace App\Domain\Auth\ValueObjects;

final class CsrfToken
{
    public function __construct(
        private readonly string $value
    ) {}

    public function getValue(): string
    {
        return $this->value;
    }

    public function isValid(string $token): bool
    {
        return hash_equals($this->value, $token);
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
