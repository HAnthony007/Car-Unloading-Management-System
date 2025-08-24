<?php

namespace App\Application\Auth\DTOs;

final class RegisterDTO
{
    public function __construct(
        public readonly string $matriculationNo,
        public readonly string $fullName,
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $avatar,
        public readonly ?string $phone,
        public readonly int $roleId
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['matriculation_no'] ?? '',
            $data['full_name'] ?? '',
            $data['email'] ?? '',
            $data['password'] ?? '',
            $data['avatar'] ?? null,
            $data['phone'] ?? null,
            (int)($data['role_id'] ?? 0)
        );
    }
}
