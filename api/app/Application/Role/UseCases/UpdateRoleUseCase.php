<?php

namespace App\Application\Role\UseCases;

use App\Application\Role\DTOs\CreateRoleDTO;
use App\Domain\Role\Entities\Role as DomainRole;
use App\Domain\Role\Repositories\RoleRepositoryInterface;
use App\Domain\Role\ValueObjects\RoleId;

final class UpdateRoleUseCase
{
    public function __construct(private readonly RoleRepositoryInterface $roleRepository) {}

    public function execute(int $id, CreateRoleDTO $dto): DomainRole
    {
        $existing = $this->roleRepository->findById(new RoleId($id));
        if (! $existing) {
            throw new \RuntimeException('Role not found');
        }

        if ($existing->getRoleName() !== $dto->roleName && $this->roleRepository->exists($dto->roleName)) {
            throw new \RuntimeException('Role name already exists');
        }

        $updated = new DomainRole(
            roleId: $existing->getRoleId(),
            roleName: $dto->roleName,
            roleDescription: $dto->roleDescription,
            created_at: $existing->getCreatedAt(),
            updated_at: now(),
        );

        return $this->roleRepository->save($updated);
    }
}
