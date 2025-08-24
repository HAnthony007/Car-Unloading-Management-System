<?php

namespace App\Application\Auth\DTOs;

final class LoginDTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $password
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['email'] ?? '',
            $data['password'] ?? ''
        );
    }
}
