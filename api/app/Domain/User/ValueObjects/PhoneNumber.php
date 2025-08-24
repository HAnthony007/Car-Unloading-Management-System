<?php

namespace App\Domain\User\ValueObjects;

use InvalidArgumentException;

final class PhoneNumber
{
    private readonly string $value;

    public function __construct(?string $phoneNumber)
    {
        if ($phoneNumber !== null) {
            $this->validate($phoneNumber);
            $this->value = $this->normalize($phoneNumber);
        }
    }

    public function getValue(): ?string
    {
        return $this->value ?? null;
    }

    public function getCountryCode(): ?string
    {
        if (!$this->hasValue()) {
            return null;
        }
        return preg_match('/^\+(\d{1,3})/', $this->value, $matches) ? $matches[1] : null;
    }

    public function getLocalNumber(): ?string
    {
        if (!$this->hasValue()) {
            return null;
        }
        return preg_match('/^\+\d{1,3}/', '',$this->value);
    }

    public function hasValue(): bool
    {
        return isset($this->value) && !empty($this->value);
    }

    public function __toString(): string
    {
        return $this->value ?? '';
    }

    public function validate(string $phoneNumber): void
    {
        if (strlen($phoneNumber) < 8) {
            throw new InvalidArgumentException('Phone number too short');
        }

        if (strlen($phoneNumber) > 20) {
            throw new InvalidArgumentException('Phone number too long');
        }
    }

    private function normalize(string $phoneNumber): string
    {
        $cleaned = preg_replace('/[^\d+]/', '', $phoneNumber);

        if (preg_match('/^\d{10,}$/', $cleaned)) {
            return $cleaned;
        }

        if (!str_starts_with($cleaned, '+') && strlen($cleaned) > 10) {
            return '+' . $cleaned;
        }

        return $cleaned;
    }
}