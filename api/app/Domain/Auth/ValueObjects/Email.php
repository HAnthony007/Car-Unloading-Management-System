<?php

namespace App\Domain\Auth\ValueObjects;

use InvalidArgumentException;

final class Email
{
    private readonly string $value;

    public function __construct(string $email)
    {
        $this->validate($email);
        $this->value = strtolower(trim($email));
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function getDomain(): string
    {
        return explode('@', $this->value)[1];
    }

    public function isFromDomain(string $domain): bool
    {
        return $this->getDomain() === strtolower($domain);
    }

    public function __toString(): string
    {
        return $this->value;
    }

    public function equals(Email $other): bool
    {
        return $this->value === $other->value;
    }

    public function validate(string $email): void
    {
        if (empty($email)) {
            throw new InvalidArgumentException('Email is required');
        }

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid email');
        }

        if (strlen($email) > 255) {
            throw new InvalidArgumentException('Email must be less than 255 characters');
        }
    }
}
