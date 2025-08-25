<?php

namespace App\Application\Role\DTOs;

final class CreateRoleDTO
{
    public function __construct(
        public readonly string $roleName,
        public readonly ?string $roleDescription
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            roleName: $data['role_name'] ?? '',
            roleDescription: $data['role_description'] ?? null,
        );
    }
}
