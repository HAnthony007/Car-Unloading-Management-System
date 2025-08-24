<?php

namespace App\Domain\Auth\ValueObjects;

use InvalidArgumentException;

final class Password
{
    private readonly string $value;

    public function __construct(string $password)
    {
        $this->validate($password);
        $this->value = $password;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isStrong(): bool
    {
        return strlen($this->value) >= 8
            && preg_match('/[A-Z]/', $this->value)
            && preg_match('/[a-z]/', $this->value)
            && preg_match('/[0-9]/', $this->value);
    }

    public function __toString(): string
    {
        return '[PROTECTED]';
    }

    public function validate(string $password): void
    {
        if (empty($password)) {
            throw new InvalidArgumentException('Password is required');
        }
        if (strlen($password) < 6) {
            throw new InvalidArgumentException('Password must be at least 6 characters');
        }
    }
}