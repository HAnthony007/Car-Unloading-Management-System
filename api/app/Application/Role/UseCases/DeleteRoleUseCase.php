<?php

namespace App\Application\Role\UseCases;

use App\Domain\Role\Repositories\RoleRepositoryInterface;
use App\Domain\Role\ValueObjects\RoleId;

final class DeleteRoleUseCase
{
    public function __construct(private readonly RoleRepositoryInterface $roleRepository) {}

    public function execute(int $id): void
    {
        $role = $this->roleRepository->findById(new RoleId($id));
        if (!$role) {
            throw new \RuntimeException('Role not found');
        }

        $this->roleRepository->delete($role);
    }
}
