<?php

namespace App\Application\Role\UseCases;

use App\Application\Role\DTOs\CreateRoleDTO;
use App\Domain\Role\Entities\Role as DomainRole;
use App\Domain\Role\Repositories\RoleRepositoryInterface;

final class CreateRoleUseCase
{
    public function __construct(private readonly RoleRepositoryInterface $roleRepository) {}

    public function execute(CreateRoleDTO $dto): DomainRole
    {
        if ($this->roleRepository->exists($dto->roleName)) {
            throw new \RuntimeException('Role name already exists');
        }

        $role = new DomainRole(
            roleId: null,
            roleName: $dto->roleName,
            roleDescription: $dto->roleDescription
        );

        return $this->roleRepository->save($role);
    }
}
