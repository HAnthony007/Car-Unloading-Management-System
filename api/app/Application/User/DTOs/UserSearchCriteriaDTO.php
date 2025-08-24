<?php

namespace App\Application\User\DTOs;

final class UserSearchCriteriaDTO
{
    public function __construct(
        public readonly ?string $matriculationPrefix = null,
        public readonly ?int $roleId = null,
        public readonly ?bool $emailVerified = null,
        public readonly ?bool $isActive = null,
        public readonly ?string $searchTerm = null,
        public readonly int $page = 1,
        public readonly int $perPage = 15,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            matriculationPrefix: $data['matriculation_prefix'] ?? null,
            roleId: isset($data['role_id']) ? (int)$data['role_id'] : null,
            emailVerified: isset($data['email_verified']) ? (bool)$data['email_verified'] : null,
            isActive: isset($data['is_active']) ? (bool)$data['is_active'] : null,
            searchTerm: $data['search_term'] ?? null,
            page: (int)($data['page'] ?? 1),
            perPage: (int)($data['per_page'] ?? 15),
        );
    }
}